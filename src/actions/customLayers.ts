export const TOGGLE_CUSTOM_LAYER = 'TOGGLE_CUSTOM_LAYER'
export const ADD_CUSTOM_LAYER = 'ADD_CUSTOM_LAYER'
export const REMOVE_CUSTOM_LAYER = 'REMOVE_CUSTOM_LAYER'

export const addCustomLayer = (geoJSON: any, filename: string) => {
  return {
    type: ADD_CUSTOM_LAYER,
    geoJSON,
    filename,
  }
}

export const removeCustomLayer = (index: number) => {
  return {
    type: REMOVE_CUSTOM_LAYER,
    index,
  }
}

export const toggleCustomLayer = (index: number) => {
  return {
    type: TOGGLE_CUSTOM_LAYER,
    index,
  }
}
