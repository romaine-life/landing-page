import { setVolume } from './audio.js';
import { setupEar } from './ear.js';
import { setupPitch } from './pitch.js';
import { setupRub } from './rub.js';

// A section's problem shows in that section, in words, until its next attempt.
function onError(section, message) {
  const box = section.querySelector('.problem');
  box.textContent = message || '';
  box.hidden = !message;
}

const volume = document.querySelector('#volume');
setVolume(Number(volume.value));
volume.addEventListener('input', () => setVolume(Number(volume.value)));

setupEar(document.querySelector('#ear'), { onError });
setupPitch(document.querySelector('#pitch'), { onError });
setupRub(document.querySelector('#rub'), { onError });
