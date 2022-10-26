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

  if (json.layers[0].layerName === 'data') {
    action.legend = json.layers[0].legend.map((element: any) => {
      const number = Number.parseFloat(element.label)
      let label = ''
      if (number === Math.min(...values)) {
        label = 'Low'
      } else if (number === Math.max(...values)) {
        label = 'High'
      }

      return {
        ...element,
        label,
      }
    })
  }
  return action
}
