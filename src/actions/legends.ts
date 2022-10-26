import { variables } from '../config'

export const REQUEST_LAYERS_LEGEND = 'REQUEST_LAYERS_LEGEND'
export const RECEIVE_LAYERS_LEGEND = 'RECEIVE_LAYERS_LEGEND'
export const RESET_LEGENDS = 'RESET_LEGENDS'

export const resetLegends = () => {
  return {
    type: RESET_LEGENDS,
  }
}

export const requestLayersLegend = () => {
  return {
    type: REQUEST_LAYERS_LEGEND,
  }
}

export const receiveLayersLegend = (json: any) => {
  const values = json.layers[0].legend
    .map((element: any) => {
      return Number.parseFloat(element.label)
    })
    .filter((number: any) => !Number.isNaN(number))

  const action = {
    type: RECEIVE_LAYERS_LEGEND,
    legend: json.layers[0].legend,
    layerName: json.layers[0].layerName,
  }

  action.legend = json.layers[0].legend.map((element: any) => {
    const number = Number.parseFloat(element.label)
    const variableConfig = variables.find(variable => variable.name === action.layerName)
    let label = ''
    if (json.layers[0].layerName === 'data') {
      if (number === Math.min(...values)) {
        label = 'Low'
      } else if (number === Math.max(...values)) {
        label = 'High'
      }
    } else if (variableConfig && !Number.isNaN(number)) {
      label = (number / variableConfig.multiplier).toString()
    }

    return {
      ...element,
      label,
    }
  })

  return action
}
