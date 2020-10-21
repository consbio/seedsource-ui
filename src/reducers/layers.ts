import config, { variables as allVariables } from '../config'
import { REMOVE_VARIABLE, SET_VARIABLES_REGION } from '../actions/variables'
import { FINISH_JOB, START_JOB } from '../actions/job'
import { TOGGLE_LAYER, LOAD_TILES } from '../actions/layers'

const { labels } = config

const defaultLayer = {
  name: null,
  label: null,
  type: null,
  urlTemplate: null,
  zIndex: 1,
  displayed: false,
  style: null,
}

export default (state: [any?] = [], action: any) => {
  let index = null

  if (action.type === LOAD_TILES) {
    if (!action.tiles.length) {
      return state
    }

    const newState = action.tiles.map((tileset: any) => {
      const serviceInfo = labels.find(label => label.serviceName === tileset.name)
      if (serviceInfo !== undefined) {
        return { ...tileset, name: serviceInfo.serviceName, label: serviceInfo.label, style: serviceInfo.style }
      }

      return { ...tileset, label: tileset.name }
    })

    return newState
  }
  if (action.type === SET_VARIABLES_REGION) {
    if (action.region === null) {
      return state.filter(layer => !layer.urlTemplate.includes('{region}_{modelTime}'))
    }
    const checkVariableLayers = state.find((layer: any) => layer.urlTemplate.includes('{region}_{modelTime}'))
    if (checkVariableLayers) {
      return state
    }
    const layersToAdd = allVariables.map(variable => ({
      ...defaultLayer,
      name: variable.name,
      label: variable.label,
      type: 'raster',
      urlTemplate: `{region}_{modelTime}Y_${variable.name}`,
    }))
    return [...state, ...layersToAdd]
  }

  switch (action.type) {
    case REMOVE_VARIABLE:
      return state.map(layer => {
        if (layer.name === action.variable) {
          return { ...layer, displayed: false }
        }
        return layer
      })

    case TOGGLE_LAYER:
      index = state.findIndex((layer: any) => layer.name === action.name)
      if (index >= 0) {
        return state
          .slice(0, index)
          .concat([{ ...state[index], displayed: !state[index].displayed }, ...state.slice(index + 1)])
      }
      break

    case START_JOB:
      index = state.findIndex(layer => layer.name === 'results')
      if (index < 0) {
        return state
      }

      return state.slice(0, index).concat(state.slice(index + 1))

    case FINISH_JOB:
      if (state.find(layer => layer.name === 'results')) {
        return state
      }

      return [
        {
          name: 'results',
          label: 'Last Run',
          type: 'raster',
          urlTemplate: '{serviceId}',
          zIndex: 2,
          displayed: true,
        },
        ...state,
      ]

    default:
      return state
  }
}
