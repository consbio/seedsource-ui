import React, { ReactNode } from 'react'
import { connect } from 'react-redux'

type RunConfigurationProps = {
  job: any
  children?: ReactNode
}

const RunConfiguration = ({ job, children = null }: RunConfigurationProps) => {
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

  return (
    <div>
      {overlay}

      {children}
    </div>
  )
}

RunConfiguration.defaultProps = {
  children: null,
}

export default connect((state: any) => {
  const { job } = state

  return {
    job,
  }
})(RunConfiguration)
