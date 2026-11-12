import type { Edge } from '@xyflow/react'

const GEN_CA = { stroke: '#4ade80', strokeWidth: 1.5 }
const GEN_SUBJ = { stroke: '#a78bfa', strokeWidth: 1.5 }
const SIGN = { stroke: '#f59e0b', strokeWidth: 2 }
const BUNDLE = { stroke: '#38bdf8', strokeWidth: 1.5 }
const TRUST = { stroke: '#2dd4bf', strokeWidth: 1.5 }

const labelStyle = { fill: '#94a3b8', fontSize: 9 }

export const certConceptsEdges: Edge[] = [
  // CA generates its key pair
  { id: 'ca-gen-priv', source: 'ca', target: 'ca-private', style: GEN_CA },
  { id: 'ca-gen-pub', source: 'ca', target: 'ca-public', style: GEN_CA },

  // Subject generates its key pair
  { id: 'subj-gen-priv', source: 'subject', target: 'subject-private', style: GEN_SUBJ },
  { id: 'subj-gen-pub', source: 'subject', target: 'subject-public', style: GEN_SUBJ },

  // CA's public key is wrapped in the CA's certificate
  {
    id: 'ca-pub-to-cert',
    source: 'ca-public',
    target: 'ca-cert',
    style: BUNDLE,
    label: 'wrapped in',
    labelStyle,
  },

  // Subject's public key is wrapped in the subject's certificate
  {
    id: 'subj-pub-to-cert',
    source: 'subject-public',
    target: 'subject-cert',
    style: BUNDLE,
    label: 'wrapped in',
    labelStyle,
  },

  // CA's private key signs the subject's certificate (the hero edge)
  {
    id: 'sign-cert',
    source: 'ca-private',
    target: 'subject-cert',
    style: SIGN,
    animated: true,
    label: 'signs',
    labelStyle,
  },

  // CA's certificate is pre-installed in the trust store
  {
    id: 'preinstall',
    source: 'ca-cert',
    target: 'trust-store',
    style: TRUST,
    label: 'pre-installed',
    labelStyle,
  },

  // Subject's certificate is presented during TLS
  {
    id: 'present-cert',
    source: 'subject-cert',
    target: 'tls',
    style: BUNDLE,
    label: 'presented',
    labelStyle,
  },

  // Subject's private key proves identity during TLS
  {
    id: 'prove-id',
    source: 'subject-private',
    target: 'tls',
    style: { ...GEN_SUBJ, strokeDasharray: '6 3' },
    animated: true,
    label: 'proves identity',
    labelStyle,
  },

  // Trust store verifies the certificate signature
  {
    id: 'verify-sig',
    source: 'trust-store',
    target: 'tls',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: TRUST,
    animated: true,
    label: 'verifies signature',
    labelStyle,
  },
]
