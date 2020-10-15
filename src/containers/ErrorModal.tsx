import React from 'react'
import { connect } from 'react-redux'
import ModalCard from '../components/ModalCard'
import { clearError } from '../actions/error'

type ErrorModalProps = {
  show: boolean
  title: string
  message: string
  debugInfo?: string | null
  onHide: () => any
}

const ErrorModal = ({ show, title, message, debugInfo, onHide }: ErrorModalProps) => {
  if (!show) {
    return null
  }

  let debug = null

  if (debugInfo !== null) {
    debug = (
      <div>
        <p>
          If the problem persists, please{' '}
          <a href="https://github.com/consbio/seedsource/issues" target="_blank" rel="noreferrer">
            report an issue
          </a>{' '}
          and include the following information:
        </p>
        <pre className="error-debug-info">{debugInfo}</pre>
      </div>
    )
  }

  return (
    <ModalCard title={title} onHide={() => onHide()} active>
      <p>{message}</p>
      {debug}
    </ModalCard>
  )
}

ErrorModal.defaultProps = {
  debugInfo: null,
}

export default connect(
  ({ error }: { error?: { title: string; message: string; debugInfo?: string } }) => {
    if (!error) {
      return { show: false, title: '', message: '', debugInfo: null }
    }

    const { title, message, debugInfo = null } = error

    return {
      show: true,
      title,
      message,
      debugInfo,
    }
  },
  dispatch => {
    return {
      onHide: () => dispatch(clearError()),
    }
  },
)(ErrorModal)
