import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import ConfigurationStep from './ConfigurationStep'
import ObjectiveButton from './ObjectiveButton'

const connector = connect(({ runConfiguration }: { runConfiguration: any }) => {
  const { objective } = runConfiguration

  return { objective }
})

type ObjectiveStepProps = ConnectedProps<typeof connector> & {
  number: number
  active: boolean
}

const ObjectiveStep = ({ number, active, objective }: ObjectiveStepProps) => {
  if (!active) {
    return (
      <ConfigurationStep title="Select objective" number={number} name="objective" active={false}>
        <div>{objective === 'seedlots' ? 'Find seedlots' : 'Find planting sites'}</div>
      </ConfigurationStep>
    )
  }

  return (
    <ConfigurationStep title="Select objective" number={number} name="objective" active>
      <div className="tabs is-toggle is-small">
        <ul>
          <ObjectiveButton name="seedlots">Find seedlots</ObjectiveButton>
          <ObjectiveButton name="sites">Find planting sites</ObjectiveButton>
        </ul>
      </div>
    </ConfigurationStep>
  )
}

ObjectiveStep.shouldRender = () => true

export default connector(ObjectiveStep)
