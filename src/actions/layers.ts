export const TOGGLE_LAYER = 'TOGGLE_LAYER'
export const LOAD_TILES = 'LOAD_TILES'

export const toggleLayer = (name: string) => {
  return {
    type: TOGGLE_LAYER,
    name,
  }
}

export const loadTiles = (tiles: string) => {
  return {
    type: LOAD_TILES,
    tiles,
  }
}
