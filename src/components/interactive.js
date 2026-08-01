import DungeonExplainer from './DungeonExplainer'
import NoclipPlan from './NoclipPlan'

// projects.js and posts.js are plain data, so interactive pieces are referenced
// by key and resolved here rather than imported into the data files.
export const INTERACTIVE = {
  'dungeon-exploded': DungeonExplainer,
  'noclip-plan': NoclipPlan,
}

export const getInteractive = name => INTERACTIVE[name] || null
