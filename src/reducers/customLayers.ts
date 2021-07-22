import { ADD_CUSTOM_LAYER, REMOVE_CUSTOM_LAYER, TOGGLE_CUSTOM_LAYER } from '../actions/customLayers'

const defaultLayer = {
  filename: '',
  geoJSON: {},
  zIndex: 2,
  displayed: true,
}

export default (state: [any?] = [], action: any) => {
  switch (action.type) {
    case ADD_CUSTOM_LAYER:
      return [{ ...defaultLayer, filename: action.filename, geoJSON: action.geoJSON }, ...state]

    case REMOVE_CUSTOM_LAYER:
      return state.filter((layer, idx) => idx !== action.index)

    case TOGGLE_CUSTOM_LAYER:
      return state.map((layer, idx) => {
        if (idx === action.index) {
          return { ...layer, displayed: !layer.displayed }
        }
        return layer
      })

    default:
      return state
  }
}
