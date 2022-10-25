import resync from '../resync'
import { requestLayersLegend, receiveLayersLegend, resetLegends } from '../actions/legends'
import config from '../config'

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
  resync(store, layerLegendSelect, ({ layers }, io, dispatch) => {
    if (layers.length) {
      const legendLayers = layers.filter((layer: any) =>
        typeof config.layers[layer].show === 'boolean'
          ? config.layers[layer].show
          : config.layers[layer].show(store.getState()) && config.layers[layer].type !== 'vector',
      )

      dispatch(resetLegends())
      legendLayers.forEach((layer: string) => {
        dispatch(requestLayersLegend())
        const { legendUrl } = config.layers[layer]
        let url
        switch (typeof legendUrl) {
          case 'undefined':
            url = ''
            break
          case 'string':
            url = legendUrl
            break
          default:
            url = legendUrl(store.getState())
        }
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
