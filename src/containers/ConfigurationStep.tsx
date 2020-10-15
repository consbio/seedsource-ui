import React from 'react'
import { connect } from 'react-redux'
import { selectStep } from '../actions/step'
import { collapsibleSteps } from '../config'

type ConfigurationStepProps = {
  active: boolean
  number: number
  title: string
  className?: string
  children: any
  onClick: () => any
}

const ConfigurationStep = ({ number, title, children, active, className, onClick }: ConfigurationStepProps) => {
  if (collapsibleSteps) {
    return (
      <div
        className={`configuration-step ${className}${active ? ' active' : ''}`}
        onClick={e => {
          e.stopPropagation()
          onClick()
        }}
      >
        <div className="gradient-top" />
        <h4>
          <span className="badge">{number}</span>
          {title}
        </h4>
        {children}
        <div className="gradient-bottom" />
      </div>
    )
  }

  return (
    <div className={`configuration-step no-collapse ${className}`}>
      <h4>
        <span className="badge">{number}</span>
        {title}
      </h4>
      <div className="step-content">{children}</div>
    </div>
  )
}

ConfigurationStep.defaultProps = {
  className: '',
}

export default connect(null, (dispatch, { name }: { name: string }) => {
  return {
    onClick: () => {
      dispatch(selectStep(name))
    },
  }
})(ConfigurationStep)
