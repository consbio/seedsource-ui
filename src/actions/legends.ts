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
  return {
    type: RECEIVE_LAYERS_LEGEND,
    legend: json.layers[0].legend.map((element: any) => ({
      ...element,
      label: element.label === '0' ? 'Low' : 'High',
    })),
    layerName: json.layers[0].layerName,
  }
}
