import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import config from '../config'
import { get } from '../io'
import { toggleLayer, loadTiles } from '../actions/layers'

type LayersProps = {
  layers: any[]
  onToggleLayer: (name: string) => any
  onLoadTiles: (tiles: any) => any
}

class Layers extends React.Component<LayersProps> {
  constructor(props: any) {
    super(props)

    this.state = {
      results: true,
      variables: true,
      seedzones: false,
      layers: false,
    }
  }

  componentDidMount() {
    const { mbtileserverRoot } = config.runtime
    const { onLoadTiles } = this.props

    if (mbtileserverRoot && mbtileserverRoot !== '') {
      get(`${mbtileserverRoot}services`)
        .then(response => response.json())
        .then(json => {
          const tileSets = json.map((service: any) => {
            const { url } = service
            return {
              name: url.substring(url.lastIndexOf('/') + 1),
              type: 'vector',
              urlTemplate: `${url}/tiles/{z}/{x}/{y}.pbf`,
              zIndex: 1,
              displayed: false,
              style: { color: 'turquoise' },
            }
          })
          onLoadTiles(tileSets)
        })
    }
  }

  render() {
    const { onToggleLayer, layers } = this.props
    const { state }: { state: any } = this

    const categories: any = {
      results: { name: t`Results`, urlIdentifier: '{serviceId}', awayMessage: t`Run the tool to view results` },
      variables: {
        name: t`Variables`,
        urlIdentifier: '{region}_{modelTime}',
        awayMessage: t`Select a region and climate scenario to view variables`,
      },
      seedZones: { name: t`Seed Zones`, urlIdentifier: 'seedzones', awayMessage: null },
      layers: { name: t`Layers`, urlIdentifier: 'layers', awayMessage: null },
    }

    const layerList = (urlIdentifier: string) =>
      layers
        .filter(layer => layer.urlTemplate.includes(urlIdentifier))
        .map(layer => {
          return (
            <li className="layer-list" key={layer.name}>
              <input className="is-checkradio" type="checkbox" value={layer.name} checked={layer.displayed} readOnly />
              <label onClick={() => onToggleLayer(layer.name)}>{layer.label}</label>
            </li>
          )
        })

    const sections = Object.keys(categories).map((key: string) => {
      if (layerList(categories[key].urlIdentifier).length < 1 && categories[key].awayMessage === null) {
        return null
      }

      return (
        <li key={key}>
          <a onClick={() => this.setState({ [key]: !state[key] })}>
            <h4 className="title">
              {state[key] ? <span className="icon-chevron-bottom-12" /> : <span className="icon-chevron-top-12" />}
              &nbsp; {categories[key].name}
            </h4>
          </a>
          {state[key] ? (
            <ul>
              {layerList(categories[key].urlIdentifier).length
                ? layerList(categories[key].urlIdentifier)
                : categories[key].awayMessage}
            </ul>
          ) : null}
        </li>
      )
    })

    return (
      <div className="layers-tab">
        <div className="menu">
          <ul className="menu-list">{sections}</ul>
        </div>
      </div>
    )
  }
}

export default connect(
  (state: any) => {
    const { layers } = state

    return { layers }
  },
  (dispatch: (action: any) => any) => {
    return {
      onToggleLayer: (name: string) => {
        dispatch(toggleLayer(name))
      },

      onLoadTiles: (tiles: any) => {
        dispatch(loadTiles(tiles))
      },
    }
  },
)(Layers)
