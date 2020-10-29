import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import ConfigurationStep from './ConfigurationStep'
import UnitButton from './UnitButton'
import Variables from './Variables'
import config from '../config'
import { addVariables } from '../actions/variables'

const connector = connect(
  ({ runConfiguration }: { runConfiguration: any }) => {
    const { variables } = runConfiguration

    return { variables }
  },
  dispatch => ({
    setDefaultVariables: () => {
      const { defaultVariables } = config

      dispatch(addVariables(defaultVariables.map(({ variable }) => variable)))
    },
  }),
)

type VariableStepProps = ConnectedProps<typeof connector> & {
  number: number
  active: boolean
}

const VariableStep = ({ number, active, variables, setDefaultVariables }: VariableStepProps) => {
  const { defaultVariables } = config
  const flag = (window as any).waffle.flag_is_active('default-vars')

  if (!active) {
    let content = (
      <div>
        <em>Click to add variables</em>
      </div>
    )

    if (variables.length > 0) {
      content = <Variables edit={false} />
    }

    return (
      <ConfigurationStep title="Select climate variables" number={number} name="variables" active={false}>
        {content}
      </ConfigurationStep>
    )
  }

  return (
    <ConfigurationStep title="Select climate variables" number={number} name="variables" active>
      <div className="margin-bottom-10">
        <strong>Units: </strong>
        <div className="tabs is-toggle is-inline-block is-small align-middle">
          <ul>
            <UnitButton name="metric">Metric</UnitButton>
            <UnitButton name="imperial">Imperial</UnitButton>
          </ul>
        </div>
      </div>

      <Variables edit />

      {flag && defaultVariables && !variables.length && (
        <>
          <div className="hr-label" style={{ margin: '10px 0' }}>
            OR
          </div>
          <button
            type="button"
            className="button is-info is-fullwidth"
            style={{ marginBottom: '10px' }}
            onClick={() => setDefaultVariables()}
          >
            Choose automatically
          </button>
        </>
      )}
    </ConfigurationStep>
  )
}

VariableStep.shouldRender = ({ runConfiguration }: any) => runConfiguration.method !== 'function'

export default connector(VariableStep)
