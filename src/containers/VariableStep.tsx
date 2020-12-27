import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { t, c } from 'ttag'
import ConfigurationStep from './ConfigurationStep'
import UnitButton from './UnitButton'
import Variables from './Variables'
import config from '../config'
import { addVariables, setDefaultVariables } from '../actions/variables'

const connector = connect(
  ({ runConfiguration }: { runConfiguration: any }) => {
    const { variables } = runConfiguration

    return { variables }
  },
  dispatch => ({
    setDefaultVariables: () => {
      const { defaultVariables } = config

      dispatch(addVariables(defaultVariables.map(({ variable }) => variable)))
      dispatch(setDefaultVariables(true))
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
        <em>{t`Click to add variables`}</em>
      </div>
    )

    if (variables.length > 0) {
      content = <Variables edit={false} />
    }

    return (
      <ConfigurationStep title={t`Select climate variables`} number={number} name="variables" active={false}>
        {content}
      </ConfigurationStep>
    )
  }

  return (
    <ConfigurationStep title={t`Select climate variables`} number={number} name="variables" active>
      <div className="margin-bottom-10">
        <strong>{t`Units:`} </strong>
        <div className="tabs is-toggle is-inline-block is-small align-middle">
          <ul>
            <UnitButton name="metric">{t`Metric`}</UnitButton>
            <UnitButton name="imperial">{t`Imperial`}</UnitButton>
          </ul>
        </div>
      </div>

      <Variables edit />

      {flag && defaultVariables && !variables.length && (
        <>
          <div className="hr-label" style={{ margin: '10px 0' }}>
            {c('e.g., this OR that').t`OR`}
          </div>
          <button
            type="button"
            className="button is-info is-fullwidth"
            style={{ marginBottom: '10px' }}
            onClick={() => setDefaultVariables()}
          >
            {t`Choose automatically`}
          </button>
        </>
      )}
    </ConfigurationStep>
  )
}

VariableStep.shouldRender = ({ runConfiguration }: any) => runConfiguration.method !== 'function'

export default connector(VariableStep)
