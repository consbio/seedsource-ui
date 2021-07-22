import React from 'react'
import { connect } from 'react-redux'
import { toggleCustomLayer, removeCustomLayer } from '../actions/customLayers'

interface customLayer {
  filename: string
  geoJSON: {}
  zIndex: number
  displayed: boolean
}

interface CustomLayerProps {
  layer: customLayer
  index: number
  onToggleCustomLayer: (index: number) => any
  onRemoveCustomLayer: (index: number) => any
}

const CustomLayer = ({ layer, index, onToggleCustomLayer, onRemoveCustomLayer }: CustomLayerProps) => {
  return (
    <li className="layer-list">
      <input className="is-checkradio" type="checkbox" value={layer.filename} checked={layer.displayed} readOnly />
      <label onClick={() => onToggleCustomLayer(index)}>{layer.filename}</label>
      <div
        className="delete"
        style={{
          display: 'inline-block',
          borderRadius: '100%',
          background: 'rgba(10, 10, 10, 0.2)',
          float: 'right',
        }}
        onClick={e => {
          e.stopPropagation()
          onRemoveCustomLayer(index)
        }}
      />
    </li>
  )
}

export default connect(null, (dispatch: (action: any) => any) => {
  return {
    onToggleCustomLayer: (index: number) => {
      dispatch(toggleCustomLayer(index))
    },
    onRemoveCustomLayer: (index: number) => {
      dispatch(removeCustomLayer(index))
    },
  }
})(CustomLayer)
