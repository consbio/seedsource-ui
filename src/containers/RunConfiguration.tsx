import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import ObjectiveStep from './ObjectiveStep'
import LocationStep from './LocationStep'
import RegionStep from './RegionStep'
import ClimateStep from './ClimateStep'
import TransferStep from './TransferStep'
import VariableStep from './VariableStep'
import TraitStep from '../components/TraitStep'
import ConstraintStep from './ConstraintStep'
import RunStep from './RunStep'
import { collapsibleSteps } from '../config'

const connector = connect((state: any) => {
  const { activeStep, job } = state

  return {
    state,
    job,
    activeStep,
  }
})

const RunConfiguration = ({ state, job, activeStep }: ConnectedProps<typeof connector>) => {
  let overlay = null

  if (job.isRunning) {
    let label = <h4 className="title is-4 is-size-5-mobile is-loading">Calculating scores...</h4>

    if (job.queued) {
      label = (
        <div>
          <h4 className="title is-4 is-size-5-mobile is-loading">Waiting for other jobs to finish...</h4>
          <div>
            Another job is currently running. Your job is queued and will run as soon as other jobs are finished.
          </div>
        </div>
      )
    }

    overlay = (
      <div className="overlay">
        <div className="progress-container">
          {label}
          <progress />
        </div>
      </div>
    )
  }

  const steps = [
    { type: ObjectiveStep, key: 'objective' },
    { type: LocationStep, key: 'location' },
    { type: RegionStep, key: 'region' },
    { type: ClimateStep, key: 'climate' },
    { type: TransferStep, key: 'transfer' },
    { type: VariableStep, key: 'variables' },
    { type: TraitStep, key: 'traits' },
    { type: ConstraintStep, key: 'constraints' },
    { type: RunStep, key: 'run' },
  ]

  return (
    <div>
      {overlay}

      {(steps as { type: any; key: string }[])
        .filter(item => (item.type as any).shouldRender(state))
        .map((item, i) => {
          return <item.type number={i + 1} key={item.key} active={activeStep === item.key || !collapsibleSteps} />
        })}
    </div>
  )
}

export default connector(RunConfiguration)
