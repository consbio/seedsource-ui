import { GeoJSON } from 'geojson'
import { ADD_CUSTOM_LAYER, REMOVE_CUSTOM_LAYER, TOGGLE_CUSTOM_LAYER } from '../actions/customLayers'
import { LOAD_CONFIGURATION, RESET_CONFIGURATION } from '../actions/saves'

export interface CustomLayer {
  filename: string
  geoJSON: GeoJSON
  zIndex: number
  displayed: boolean
}

const defaultLayer: CustomLayer = {
  filename: '',
  geoJSON: { type: 'Polygon', coordinates: [] },
  zIndex: 2,
  displayed: true,
}

export default (state: CustomLayer[] = [], action: any) => {
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

    case RESET_CONFIGURATION:
      return []

    case LOAD_CONFIGURATION:
      if (action.configuration.customLayers) {
        return action.configuration.customLayers
      }
      return state

    default:
      return state
  }
}
