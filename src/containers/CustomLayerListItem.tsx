import React from 'react'
import { connect } from 'react-redux'
import ColorPicker from './ColorPicker'
import { toggleCustomLayer, removeCustomLayer, setCustomColor } from '../actions/customLayers'
import { CustomLayer, customLayerColors } from '../reducers/customLayers'

interface CustomLayerListItemProps {
  layer: CustomLayer
  index: number
  onToggleCustomLayer: (index: number) => any
  onRemoveCustomLayer: (index: number) => any
  onSetCustomColor: (index: number, color: string) => any
}

interface CustomLayerListItemState {
  colorPicker: boolean
}

class CustomLayerListItem extends React.Component<CustomLayerListItemProps, CustomLayerListItemState> {
  constructor(props: any) {
    super(props)

    this.state = { colorPicker: false }
  }

  render() {
    const { layer, index, onToggleCustomLayer, onRemoveCustomLayer, onSetCustomColor } = this.props
    const { colorPicker } = this.state
    return (
      <li className="layer-list" style={{ marginTop: '10px' }}>
        <div
          tabIndex={0}
          role="button"
          aria-label="Button to pick a new color for the custom layer."
          onClick={() =>
            this.setState(() => {
              return { colorPicker: !colorPicker }
            })}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              this.setState(() => {
                return { colorPicker: !colorPicker }
              })
            }
          }}
          className="is-clickable"
          style={{
            float: 'left',
            height: '20px',
            width: '20px',
            borderRadius: '100%',
            background: layer.color,
            marginRight: '12px',
          }}
        />
        <input
          className="is-checkradio"
          type="checkbox"
          aria-label="Checkbox to show or hide custom layer on map."
          value={layer.filename}
          checked={layer.displayed}
          readOnly
        />
        <label onClick={() => onToggleCustomLayer(index)}>{layer.filename}</label>
        <div
          tabIndex={0}
          role="button"
          aria-label="Button to delete custom layer."
          className="delete"
          style={{
            display: 'inline-block',
            borderRadius: '100%',
            background: 'rgba(10, 10, 10, 0.2)',
            float: 'right',
          }}
          onClick={() => {
            onRemoveCustomLayer(index)
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') onRemoveCustomLayer(index)
          }}
        />
        {colorPicker ? (
          <ColorPicker
            colors={customLayerColors}
            onPick={(color: string) => {
              onSetCustomColor(index, color)
              this.setState({ colorPicker: false })
            }}
          />
        ) : null}
      </li>
    )
  }
}

export default connect(null, (dispatch: (action: any) => any) => {
  return {
    onToggleCustomLayer: (index: number) => {
      dispatch(toggleCustomLayer(index))
    },
    onRemoveCustomLayer: (index: number) => {
      dispatch(removeCustomLayer(index))
    },
    onSetCustomColor: (index: number, color: string) => {
      dispatch(setCustomColor(index, color))
    },
  }
})(CustomLayerListItem)
