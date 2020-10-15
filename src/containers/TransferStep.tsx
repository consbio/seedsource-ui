import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { selectCenter } from '../actions/variables'
import ConfigurationStep from './ConfigurationStep'
import MethodButton from './MethodButton'
import SpeciesChooser from './SpeciesChooser'
import SeedZoneChooser from './SeedZoneChooser'
import config from '../config'

const connector = connect(
  ({ runConfiguration }: { runConfiguration: any }) => {
    const { objective, method, center } = runConfiguration

    return { objective, method, center }
  },
  dispatch => {
    return {
      onCenterChange: (center: string) => {
        dispatch(selectCenter(center))
      },
    }
  },
)

type TransferStepProps = ConnectedProps<typeof connector> & {
  number: number
  active: boolean
}

const TransferStep = ({ number, active, objective, method, center, onCenterChange }: TransferStepProps) => {
  if (!active) {
    let label

    if (method === 'seedzone') {
      label = 'Transfer limits based on seed zone, climatic center based on the selected location'

      if (center === 'zone') {
        label = 'Transfer limits and climatic center based on seed zone'
      }
    } else {
      label = 'Custom transfer limits, climatic center based on the selected location'
    }

    return (
      <ConfigurationStep title="Select transfer limit method" number={number} name="transfer" active={false}>
        <div>{label}</div>
      </ConfigurationStep>
    )
  }

  let centerNode = null

  if (method === 'seedzone' && objective === 'sites') {
    centerNode = (
      <div>
        <div className="is-size-7">
          <em>Which should be used as the climatic center?</em>
        </div>
        <div className="control">
          <div>
            <label className="radio">
              <input type="radio" checked={center === 'point'} onChange={() => onCenterChange('point')} />
              The value at the selected location
            </label>
          </div>
          <div>
            <label className="radio">
              <input type="radio" checked={center === 'zone'} onChange={() => onCenterChange('zone')} />
              The climatic center of the zone
            </label>
          </div>
        </div>
        <div>&nbsp;</div>
      </div>
    )
  }

  const hasFunctions = !!config.functions && config.functions.length > 0

  return (
    <ConfigurationStep title="Select transfer limit method" number={number} name="transfer" active>
      <div className="tabs is-toggle is-small">
        <ul>
          <MethodButton name="custom">Custom</MethodButton>
          <MethodButton name="seedzone">Zone</MethodButton>
          {hasFunctions ? <MethodButton name="function">Function</MethodButton> : null}
        </ul>
      </div>
      {centerNode}
      {method !== 'custom' ? <SpeciesChooser generic={method !== 'function'} /> : null}
      <div style={{ height: '10px' }} />
      {method === 'seedzone' ? <SeedZoneChooser /> : null}
    </ConfigurationStep>
  )
}

TransferStep.shouldRender = () => true

export default connector(TransferStep)
