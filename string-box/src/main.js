import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

// The board as built, in the order the build guide solders it (string-box docs/BUILD.md).
// KiCad parts are matched by their 3D model's name, the modelled plug-in parts by node name.
const STAGES = [
  { model: /^TSSOP/, title: 'Converter chips', detail: 'Three PCM1808s, the only surface-mount parts' },
  { model: /^R_Axial/, title: 'Resistors' },
  { model: /^C_Disc/, title: 'Ceramic capacitors' },
  { model: /^DIP_8/, title: 'Op-amp sockets' },
  { model: /^C_Rect/, title: 'Film capacitors' },
  { model: /^CP_Radial/, title: 'Electrolytic capacitors' },
  { model: /^Potentiometer/, title: 'Gain trimmers', detail: 'One per string' },
  { model: /^PinSocket/, title: 'Teensy sockets' },
  { model: /^PinHeader/, node: /^ASSY_TRRS/, title: 'Pickup sockets', detail: 'Two TRRS breakouts, three strings each' },
  { node: /^ASSY_TEENSY/, title: 'Teensy 4.1', detail: 'Clocks the converters and streams all six strings' },
  { node: /^ASSY_OPAMP/, title: 'Preamps', detail: 'Three MCP6022s, two strings each' },
  { node: /^ASSY_(PLUG|USB)/, title: 'Cables', detail: 'The pickup in on the left, USB out at the top', slide: true },
]

const DROP = 0.045          // metres a part falls from
const PART_TIME = 0.55      // seconds for one part to land
const STAGE_SPREAD = 1.1    // seconds over which a stage's parts start, left to right
const STAGE_HOLD = 0.5      // seconds between stages

const canvas = document.getElementById('view')
const statusEl = document.getElementById('status')
const caption = document.getElementById('caption')
const buttons = document.getElementById('buttons')
const q = new URLSearchParams(location.search)

function fail(message) {
  statusEl.textContent = message
  statusEl.className = 'error'
}

let renderer
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
} catch (e) {
  fail('This browser can’t show 3D (WebGL is off or unsupported).')
  throw e
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight, false)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

const scene = new THREE.Scene()
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.7

const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.005, 10)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotateSpeed = 0.8
controls.enabled = false

const sun = new THREE.DirectionalLight(0xffffff, 1.6)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.bias = -0.0002
sun.shadow.radius = 3
const under = new THREE.DirectionalLight(0xffffff, 1.3) // lights the back when it's turned up
under.position.set(0.3, -1, -0.4)
scene.add(sun, sun.target, under)

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight, false)
})

statusEl.textContent = 'Loading the board…'
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
loader.load(
  'string-box.glb',
  gltf => {
    statusEl.textContent = ''
    start(gltf)
  },
  e => {
    if (e.lengthComputable) statusEl.textContent = `Loading the board… ${Math.round(100 * e.loaded / e.total)}%`
  },
  e => {
    fail('The board model didn’t load. Reload the page to try again.')
    console.error(e)
  },
)

const parts = []      // { obj, home, from, stage, delay }
let timeline = []     // { stage, at, end }
let clock = null      // seconds into the build, or null when it's done
let flipped = false
let look = null       // camera move in progress: { from, to, t }

function start(gltf) {
  let root = gltf.scene
  while (root.children.length === 1) root = root.children[0]
  scene.add(gltf.scene)

  // KiCad writes its display colours (sRGB) where glTF expects linear values, and gives every
  // part model a fully metallic, fully rough material; parts are plastic, so only the copper
  // (metallic and smoother) stays metal. Its silkscreen is slightly see-through and can sort
  // under the solder mask; real ink is opaque, so it is drawn that way.
  const fixed = new Set()
  gltf.scene.traverse(o => {
    if (!o.isMesh) return
    o.castShadow = true
    o.receiveShadow = true
    for (const m of [o.material].flat()) {
      if (fixed.has(m)) continue
      fixed.add(m)
      m.color.convertSRGBToLinear()
      if (m.metalness === 1 && m.roughness === 1) {
        m.metalness = 0
        m.roughness = 0.55
      }
      if (m.transparent && m.color.r > 0.9 && m.color.g > 0.9 && m.color.b > 0.9) {
        m.transparent = false
        m.depthWrite = true
        m.opacity = 1
      }
    }
  })

  const modelName = obj => {
    let name = ''
    obj.traverse(o => {
      const a = !name && o.isMesh && gltf.parser.associations.get(o)
      if (a && a.meshes !== undefined) name = gltf.parser.json.meshes[a.meshes].name || ''
    })
    return name
  }

  // Frame on the board itself: everything that isn't a part.
  const board = new THREE.Box3()
  const all = new THREE.Box3().setFromObject(gltf.scene)
  for (const obj of root.children) {
    const model = modelName(obj)
    const stage = STAGES.findIndex(s => (s.model && s.model.test(model)) || (s.node && s.node.test(obj.name)))
    if (stage < 0) {
      if (/^(ASSY_)?[A-Z]+\d/.test(obj.name)) console.warn('part not in any build stage, shown from the start:', obj.name, model)
      else board.expandByObject(obj)
      continue
    }
    parts.push({ obj, stage, home: obj.position.clone() })
  }
  if (board.isEmpty()) board.copy(all)

  const centre = board.getCenter(new THREE.Vector3())
  const size = board.getSize(new THREE.Vector3())
  controls.target.copy(centre)
  const reach = Math.max(size.x, size.z)
  controls.minDistance = reach * 0.25
  controls.maxDistance = reach * 8

  sun.position.copy(centre).add(new THREE.Vector3(-0.3, 0.9, 0.5).multiplyScalar(reach))
  sun.target.position.copy(centre)
  const cam = sun.shadow.camera
  cam.left = cam.bottom = -reach * 0.8
  cam.right = cam.top = reach * 0.8
  cam.near = reach * 0.2
  cam.far = reach * 3
  cam.updateProjectionMatrix()

  // A floor that only shows the board's shadow; from below it's invisible.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(reach * 6, reach * 6), new THREE.ShadowMaterial({ opacity: 0.35 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set(centre.x, all.min.y - reach * 0.02, centre.z)
  floor.receiveShadow = true
  scene.add(floor)

  view = side => side === 'back' ? backView(centre, reach) : frontView(centre, reach)
  camera.position.copy(view('front'))

  // Each part falls (or, for cables, slides along its plug's axis) into place.
  const insert = new THREE.Vector3()
  for (const p of parts) {
    const s = STAGES[p.stage]
    if (s.slide) {
      const box = new THREE.Box3().setFromObject(p.obj)
      const c = box.getCenter(new THREE.Vector3())
      insert.set(c.x < centre.x - size.x * 0.3 ? -1 : 0, 0, c.x < centre.x - size.x * 0.3 ? 0 : -1)
      p.from = p.home.clone().addScaledVector(insert, DROP)
    } else {
      p.from = p.home.clone().add(new THREE.Vector3(0, DROP, 0))
    }
    p.x = new THREE.Box3().setFromObject(p.obj).getCenter(new THREE.Vector3()).x
  }

  let at = 0.4
  timeline = []
  STAGES.forEach((s, i) => {
    const mine = parts.filter(p => p.stage === i).sort((a, b) => a.x - b.x)
    if (!mine.length) return
    const xs = mine.map(p => p.x)
    const lo = Math.min(...xs), span = Math.max(...xs) - lo || 1
    for (const p of mine) p.delay = at + (mine.length > 1 ? STAGE_SPREAD * (p.x - lo) / span : 0)
    const end = Math.max(...mine.map(p => p.delay)) + PART_TIME
    timeline.push({ stage: i, at, end })
    at = end + STAGE_HOLD
  })

  const dots = document.getElementById('dots')
  dots.replaceChildren(...timeline.map(() => document.createElement('li')))

  buttons.hidden = false
  controls.enabled = true
  controls.addEventListener('start', () => {
    look = null
    setSpin(false)
  })

  // ?view=back opens on the finished board's back; ?build=0 skips the build.
  if (q.get('view') === 'back') {
    finish()
    flip()
    look = null
    camera.position.copy(view('back'))
  } else if (q.get('build') === '0') {
    finish()
    setSpin(true)
  } else {
    rebuild()
  }

  renderer.setAnimationLoop(frame)
}

let view

// Further back on narrow screens, so the board's length still fits across.
const fit = () => 1.25 * Math.max(1, 1.15 / camera.aspect)

function frontView(c, r) {
  return c.clone().add(new THREE.Vector3(-0.3, 0.8, 1.15).multiplyScalar(r * fit()))
}

// Seen from below with the top edge kept at the top, as KiCad shows the back.
function backView(c, r) {
  return c.clone().add(new THREE.Vector3(-0.2, -1.05, -0.6).multiplyScalar(r * fit()))
}

function rebuild() {
  clock = 0
  caption.hidden = false
  document.getElementById('build').textContent = 'Skip to the end'
  if (flipped) flip()
  setSpin(true)
  for (const p of parts) {
    p.obj.visible = false
    p.obj.position.copy(p.from)
  }
}

function finish() {
  clock = null
  caption.hidden = true
  document.getElementById('build').textContent = 'Build it again'
  for (const p of parts) {
    p.obj.visible = true
    p.obj.position.copy(p.home)
  }
}

const ease = t => 1 - Math.pow(1 - t, 3)

function showCaption(n) {
  const entry = timeline[n]
  const s = STAGES[entry.stage]
  document.getElementById('step').textContent = `Step ${n + 1} of ${timeline.length}`
  document.getElementById('title').textContent = s.title
  document.getElementById('detail').textContent = s.detail || ''
  ;[...document.getElementById('dots').children].forEach((d, i) => d.classList.toggle('done', i <= n))
}

let shownStage = -1
let last = performance.now()

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1)
  last = now

  if (clock !== null) {
    clock += dt
    for (const p of parts) {
      const t = (clock - p.delay) / PART_TIME
      p.obj.visible = t > 0
      if (t > 0) p.obj.position.lerpVectors(p.from, p.home, ease(Math.min(t, 1)))
    }
    let n = -1
    timeline.forEach((e, i) => { if (clock >= e.at) n = i })
    if (n !== shownStage && n >= 0) showCaption(n)
    shownStage = n
    if (clock > timeline[timeline.length - 1].end + 1.2) {
      finish()
      shownStage = -1
    }
  }

  if (look) {
    look.t = Math.min(look.t + dt / 1.2, 1)
    camera.position.lerpVectors(look.from, look.to, ease(look.t))
    if (look.t === 1) look = null
  }

  controls.update(dt)
  renderer.render(scene, camera)
}

function flip() {
  flipped = !flipped
  setSpin(false)
  look = { from: camera.position.clone(), to: view(flipped ? 'back' : 'front'), t: 0 }
  document.getElementById('flip').textContent = flipped ? 'Show the front' : 'Show the back'
}

function setSpin(on) {
  controls.autoRotate = on
  const b = document.getElementById('spin')
  b.textContent = on ? 'Stop spinning' : 'Spin'
  b.setAttribute('aria-pressed', String(on))
}

document.getElementById('build').addEventListener('click', () => (clock === null ? rebuild() : finish()))
document.getElementById('flip').addEventListener('click', flip)
document.getElementById('spin').addEventListener('click', () => setSpin(!controls.autoRotate))
