import { GeoJSON } from 'geojson'
import { ADD_CUSTOM_LAYER, REMOVE_CUSTOM_LAYER, TOGGLE_CUSTOM_LAYER, SET_CUSTOM_COLOR } from '../actions/customLayers'
import { LOAD_CONFIGURATION, RESET_CONFIGURATION } from '../actions/saves'

export interface CustomLayer {
  filename: string
  geoJSON: GeoJSON
  zIndex: number
  displayed: boolean
  color: string
}

// Named colors used so screen readers can read them in ColorPicker
export const customLayerColors = ['mediumSeaGreen', 'salmon', 'cornflowerBlue', 'orchid', 'hotPink']

const defaultLayer: CustomLayer = {
  filename: '',
  geoJSON: { type: 'Polygon', coordinates: [] },
  zIndex: 2,
  displayed: true,
  color: customLayerColors[0],
}

const getLeastUsedColor = (state: CustomLayer[]) => {
  const colorsCount = new Array(customLayerColors.length).fill(0)
  state.forEach((layer: CustomLayer) => {
    const colorIndex = customLayerColors.indexOf(layer.color)
    colorsCount[colorIndex] += 1
  })
  const indexMin = colorsCount.indexOf(Math.min(...colorsCount))
  return customLayerColors[indexMin]
}

export default (state: CustomLayer[] = [], action: any) => {
  switch (action.type) {
    case ADD_CUSTOM_LAYER:
      return [
        { ...defaultLayer, filename: action.filename, geoJSON: action.geoJSON, color: getLeastUsedColor(state) },
        ...state,
      ]

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

    case SET_CUSTOM_COLOR:
      return state.map((layer, idx) => {
        if (idx === action.index) {
          return { ...layer, color: action.color }
        }
        return layer
      })

    default:
      return state
  }
}
