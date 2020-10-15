import React from 'react'
import { connect } from 'react-redux'
import ConstraintChooser from '../components/ConstraintChooser'
import ConfigurationStep from './ConfigurationStep'
import config from '../config'
import { addConstraint } from '../actions/constraints'

const { constraints: constraintsConfig } = config

type ConstraintStepProps = {
  number: number
  constraints: any[]
  onChange: (selection: any) => any
}

const ConstraintStep = ({ number, constraints, onChange }: ConstraintStepProps) => {
  let table = null

  if (constraints.length) {
    table = (
      <table className="table is-fullwidth">
        <thead className="is-size-7">
          <tr>
            <td />
            <th>Name</th>
            <th>Value</th>
            <th>Range (+/-)</th>
          </tr>
        </thead>
        <tbody>
          {constraints.map(({ type, name, values }, i) => {
            const ConstraintTag = constraintsConfig.objects[name].component
            return <ConstraintTag index={i} values={values} key={`${type}_${name}`} />
          })}
        </tbody>
      </table>
    )
  }

  return (
    <ConfigurationStep title="Apply constraints" number={number} name="constraints" active className="constraint-step">
      {table}
      <ConstraintChooser onAdd={onChange} />
    </ConfigurationStep>
  )
}

ConstraintStep.shouldRender = () => true

export default connect(
  ({ runConfiguration }: { runConfiguration: any }) => {
    const { constraints } = runConfiguration
    return { constraints }
  },
  (dispatch: (event: any) => any) => ({
    onChange: (constraint: any) => dispatch(addConstraint(constraint)),
  }),
)(ConstraintStep)
