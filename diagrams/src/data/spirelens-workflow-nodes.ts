import type { Node } from '@xyflow/react'

export type SpireLensWorkflowNodeData = {
  label: string
  description: string
  detail?: string
  category: 'human' | 'save' | 'agent' | 'code' | 'game' | 'mcp' | 'evidence' | 'guardrail' | 'pr'
}

export type SpireLensWorkflowNode = Node<SpireLensWorkflowNodeData>

const COL = {
  human: 0,
  base: 340,
  plan: 720,
  code: 1100,
  install: 1480,
  game: 1860,
  runtime: 2240,
  evidence: 2620,
  pr: 3000,
}

const ROW = {
  top: 0,
  mid: 150,
  bot: 300,
  low: 450,
}

const wide = { width: 280, height: 96 }

export const spireLensWorkflowNodes: SpireLensWorkflowNode[] = [
  {
    id: 'issue',
    type: 'spirelens-workflow',
    position: { x: COL.human, y: ROW.mid },
    ...wide,
    data: {
      label: 'Issue Request',
      description: 'Human issue describes the desired card behavior change and expected proof.',
      detail: 'Example: make Make It So track the three skill trigger correctly.',
      category: 'human',
    },
  },
  {
    id: 'base-saves',
    type: 'spirelens-workflow',
    position: { x: COL.base, y: ROW.top },
    ...wide,
    data: {
      label: 'Character Base Saves',
      description: 'One reusable save per character, captured after run initialization.',
      detail: 'Ironclad, Silent, Regent, Necrobinder, Defect.',
      category: 'save',
    },
  },
  {
    id: 'catalog',
    type: 'spirelens-workflow',
    position: { x: COL.base, y: ROW.bot },
    ...wide,
    data: {
      label: 'Game Catalog MCP',
      description: 'Live lookup for cards, owners, characters, commands, and scenario-safe IDs.',
      detail: 'Agents should ask the game instead of guessing from memory.',
      category: 'mcp',
    },
  },
  {
    id: 'planner',
    type: 'spirelens-workflow',
    position: { x: COL.plan, y: ROW.mid },
    ...wide,
    data: {
      label: 'LLM 1: Test Primitives',
      description: 'Cold LLM phase resolves card identity, base character, required deck, encounter, and abort conditions.',
      detail: 'Fails early if the card is ambiguous or the requested setup is not viable.',
      category: 'agent',
    },
  },
  {
    id: 'code-agent',
    type: 'spirelens-workflow',
    position: { x: COL.code, y: ROW.mid },
    ...wide,
    data: {
      label: 'LLM 2: Code Change',
      description: 'Applies the smallest viable repo change after the primitive plan is known.',
      detail: 'Fails closed if solving requires a dramatic rewrite, new library, or unclear ownership.',
      category: 'code',
    },
  },
  {
    id: 'materialize',
    type: 'spirelens-workflow',
    position: { x: COL.install, y: ROW.top },
    ...wide,
    data: {
      label: 'Materialize Scenario Save',
      description: 'Copy a base save and rewrite deck, relics, HP, gold, energy, and next encounter queue.',
      detail: 'Offline save edits are the setup layer, not the live-game control layer.',
      category: 'save',
    },
  },
  {
    id: 'two-path-install',
    type: 'spirelens-workflow',
    position: { x: COL.install, y: ROW.mid + 55 },
    ...wide,
    data: {
      label: 'Install To Both Save Mirrors',
      description: 'Write current_run.save and backup in AppData and Steam userdata remote.',
      detail: 'This prevents Steam Remote Storage from restoring an older local mirror on launch.',
      category: 'guardrail',
    },
  },
  {
    id: 'launch',
    type: 'spirelens-workflow',
    position: { x: COL.game, y: ROW.mid },
    ...wide,
    data: {
      label: 'Launch And Load',
      description: 'Start STS2, reach the menu, then load the prepared run through Continue or MCP load.',
      detail: 'Do not edit current_run.save after the game process is running.',
      category: 'game',
    },
  },
  {
    id: 'runtime-setup',
    type: 'spirelens-workflow',
    position: { x: COL.runtime, y: ROW.top },
    ...wide,
    data: {
      label: 'Runtime MCP Setup',
      description: 'After combat exists, set enemy HP/status, energy/stars, and exact hand/draw/discard piles.',
      detail: 'Enemy internals are more reliable as runtime mutations than save edits.',
      category: 'mcp',
    },
  },
  {
    id: 'test-agent',
    type: 'spirelens-workflow',
    position: { x: COL.runtime, y: ROW.bot },
    ...wide,
    data: {
      label: 'LLM 3: Verifier',
      description: 'Executes the planned validation steps in the live game and records pass/fail facts.',
      detail: 'Uses small invocations so logs, cost, and failure reasons stay auditable.',
      category: 'agent',
    },
  },
  {
    id: 'screenshots',
    type: 'spirelens-workflow',
    position: { x: COL.evidence, y: ROW.top },
    ...wide,
    data: {
      label: 'Full Game Screenshot',
      description: 'Capture target-visible proof from the MCP screenshot surface.',
      detail: 'Default evidence is the full game screen; tight crops can be additional.',
      category: 'evidence',
    },
  },
  {
    id: 'summary',
    type: 'spirelens-workflow',
    position: { x: COL.evidence, y: ROW.bot },
    ...wide,
    data: {
      label: 'Phase Summaries',
      description: 'Each phase reports result, cost, PR link, screenshots, and explicit pass/fail.',
      detail: 'Verifier failure aborts today; future loop may retry with a new scenario.',
      category: 'evidence',
    },
  },
  {
    id: 'pull-request',
    type: 'spirelens-workflow',
    position: { x: COL.pr, y: ROW.mid },
    ...wide,
    data: {
      label: 'Pull Request',
      description: 'Final bullet point: link the generated PR with test result, screenshots, and total cost.',
      detail: 'This is the far-right handoff for human review and merge.',
      category: 'pr',
    },
  },
  {
    id: 'abort',
    type: 'spirelens-workflow',
    position: { x: COL.plan, y: ROW.low },
    ...wide,
    data: {
      label: 'Abort Reasons',
      description: 'Ambiguous card, dramatic code change, impossible scenario, verifier rejection.',
      detail: 'Specific failure is better than a misleading green result.',
      category: 'guardrail',
    },
  },
]
