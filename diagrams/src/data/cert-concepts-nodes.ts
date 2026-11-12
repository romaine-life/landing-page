import type { Node } from '@xyflow/react'

export type CertConceptsNodeData = {
  label: string
  description: string
  category: 'ca' | 'subject' | 'key' | 'cert' | 'trust' | 'insight' | 'section'
  dimmed?: boolean
}

export type CertConceptsNode = Node<CertConceptsNodeData>

const COL_W = 275
const col = (n: number) => n * COL_W
const mid = (a: number, b: number) => (col(a) + col(b)) / 2

const ROW = {
  labelIssuance: -80,
  entities: 0,
  keys: 190,
  certs: 400,
  insight: 530,
  labelConnection: 610,
  verify: 700,
}

export const certConceptsNodes: CertConceptsNode[] = [
  // ── Section: Issuance ──
  {
    id: 'label-issuance',
    type: 'cert-concepts',
    position: { x: col(0), y: ROW.labelIssuance },
    data: {
      label: 'ISSUANCE',
      description:
        'Happens once during setup. The subject sends a Certificate Signing Request to the CA, asking to be vouched for.',
      category: 'section',
    },
  },

  // ── Entities ──
  {
    id: 'ca',
    type: 'cert-concepts',
    position: { x: mid(0, 1), y: ROW.entities },
    data: {
      label: 'Certificate Authority (CA)',
      description:
        'Issues and signs certificates. Cryptographically just a key pair — the "authority" part is a trust decision, not math.',
      category: 'ca',
    },
  },
  {
    id: 'subject',
    type: 'cert-concepts',
    position: { x: mid(2, 3), y: ROW.entities },
    data: {
      label: 'Web Server (Subject)',
      description:
        'The entity requesting a certificate. Generates its own independent key pair.',
      category: 'subject',
    },
  },

  // ── Keys ──
  {
    id: 'ca-private',
    type: 'cert-concepts',
    position: { x: col(0), y: ROW.keys },
    data: {
      label: "CA's Private Key",
      description: "Signs the subject's certificate. Never leaves the CA.",
      category: 'key',
    },
  },
  {
    id: 'ca-public',
    type: 'cert-concepts',
    position: { x: col(1), y: ROW.keys },
    data: {
      label: "CA's Public Key",
      description:
        "Wrapped inside the CA's own certificate. That certificate is what trust stores ship.",
      category: 'key',
    },
  },
  {
    id: 'subject-private',
    type: 'cert-concepts',
    position: { x: col(2), y: ROW.keys },
    data: {
      label: "Subject's Private Key",
      description:
        "Proves identity during TLS. Never leaves the server. Different job than the CA's private key.",
      category: 'key',
    },
  },
  {
    id: 'subject-public',
    type: 'cert-concepts',
    position: { x: col(3), y: ROW.keys },
    data: {
      label: "Subject's Public Key",
      description:
        'Bundled into the subject\'s certificate. This is what the cert is "about".',
      category: 'key',
    },
  },

  // ── Certificates (both sides have one!) ──
  {
    id: 'ca-cert',
    type: 'cert-concepts',
    position: { x: mid(0, 1), y: ROW.certs },
    data: {
      label: "CA's Certificate",
      description:
        "Wraps the CA's public key + identity. Same data structure as the subject's cert — just a different role.",
      category: 'cert',
    },
  },
  {
    id: 'subject-cert',
    type: 'cert-concepts',
    position: { x: mid(2, 3), y: ROW.certs },
    data: {
      label: "Subject's Certificate",
      description:
        "Wraps the subject's public key + identity, signed by the CA's private key. Issued in response to the subject's CSR.",
      category: 'cert',
    },
  },

  // ── Insight callout ──
  {
    id: 'insight-same-structure',
    type: 'cert-concepts',
    position: { x: mid(1, 2) - 10, y: ROW.insight },
    data: {
      label: 'The Slippery Part',
      description:
        'Both sides have a certificate — same structure, different role. And the subject is the one who requests it (via CSR), not the other way around.',
      category: 'insight',
    },
  },

  // ── Section: Every Connection ──
  {
    id: 'label-connection',
    type: 'cert-concepts',
    position: { x: col(0), y: ROW.labelConnection },
    data: {
      label: 'EVERY CONNECTION',
      description:
        'On each TLS handshake, the browser checks the cert against its trust store and the server proves identity.',
      category: 'section',
    },
  },

  // ── Verification ──
  {
    id: 'trust-store',
    type: 'cert-concepts',
    position: { x: mid(0, 1), y: ROW.verify },
    data: {
      label: 'Trust Store (Browser / OS)',
      description:
        "Ships with CA certificates pre-installed. This is what makes the CA 'trusted'.",
      category: 'trust',
    },
  },
  {
    id: 'tls',
    type: 'cert-concepts',
    position: { x: mid(2, 3), y: ROW.verify },
    data: {
      label: 'TLS Handshake',
      description:
        "Client verifies the subject's cert using the CA cert from the trust store, then the server proves it holds the matching private key.",
      category: 'trust',
    },
  },
]
