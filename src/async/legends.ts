import resync from '../resync'
import { requestLayersLegend, receiveLayersLegend, resetLegends } from '../actions/legends'
import { getLayerUrl } from '../utils'

// Possibly add: `legends`
const layerLegendSelect = ({ layers, runConfiguration, job }: any) => {
  const { objective, climate, region } = runConfiguration
  const { serviceId } = job

  // Possibly add: `hasLegend: legends.results.legend !== null`
  return {
    layers,
    objective,
    climate,
    region,
    serviceId,
  }
}

export default (store: any) => {
  // Layers legend
  resync(store, layerLegendSelect, ({ layers, serviceId, objective, climate, region }, io, dispatch) => {
    if (layers.length) {
      const legendLayers = layers.filter((layer: any) => layer.displayed === true && layer.type !== 'vector')
      dispatch(resetLegends())
      legendLayers.forEach((layer: any) => {
        dispatch(requestLayersLegend())
        const newrl = getLayerUrl(layer, serviceId, objective, climate, region)
        const url = `/arcgis/rest/services/${newrl}/MapServer/legend`
        return io
          .get(url)
          .then(response => response.json())
          .then(json => {
            dispatch(receiveLayersLegend(json))
          })
      })
    }
  })
}
