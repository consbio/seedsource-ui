import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import ConfigurationStep from './ConfigurationStep'
import UnitButton from './UnitButton'
import Variables from './Variables'

const connector = connect(({ runConfiguration }: { runConfiguration: any }) => {
  const { variables } = runConfiguration

  return { variables }
})

type VariableStepProps = ConnectedProps<typeof connector> & {
  number: number
  active: boolean
}

const VariableStep = ({ number, active, variables }: VariableStepProps) => {
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
    </ConfigurationStep>
  )
}

VariableStep.shouldRender = ({ runConfiguration }: any) => runConfiguration.method !== 'function'

export default connector(VariableStep)
