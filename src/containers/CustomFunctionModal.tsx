import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { t } from 'ttag'
import { variables } from '../config'
import ModalCard from '../components/ModalCard'
import {
  createFunction as createFunctionConnect,
  deleteFunction as deleteFunctionConnect,
  setFunction as setFunctionConnect,
} from '../actions/customFunctions'
import { getNames } from '../parser'

const connector = connect(
  ({ runConfiguration }: { runConfiguration: { customFunctions: any[] } }, { index }: { index: number }) => {
    const { customFunctions } = runConfiguration
    const customFunction = customFunctions[index]
    return { customFunction }
  },
  (dispatch: (action: any) => any) => {
    return {
      createFunction: (name: string, func: string) => dispatch(createFunctionConnect(name, func)),
      setFunction: (index: number, name: string, func: string) => dispatch(setFunctionConnect(index, name, func)),
      deleteFunction: (index: number) => dispatch(deleteFunctionConnect(index)),
    }
  },
)

const CustomFunctionModal = (
  props: ConnectedProps<typeof connector> & { index: number; deactivateModal: () => void },
) => {
  const { index, customFunction, deactivateModal, createFunction, setFunction, deleteFunction } = props
  const [name, setName] = useState(customFunction ? customFunction.name : '')
  const [func, setFunc] = useState(customFunction ? customFunction.func : '')
  const validateName = () => {
    if (!name) {
      alert('Please name your function')
      return false
    }
    return true
  }

  const validateFunc = () => {
    const functionVariables = getNames(func)
    const variableNames = variables.map(v => v.name)
    const invalidVariables: string[] = []
    functionVariables.forEach(v => {
      if (![...variableNames, 'math_e'].includes(v)) {
        invalidVariables.push(v)
      }
    })
    if (invalidVariables.length > 0) {
      alert(`The following variables are not valid: ${invalidVariables.join(', ')}`)
      return false
    }
    return true
  }

  const onSave = () => {
    if (!validateName()) {
      return
    }
    if (!validateFunc()) {
      return
    }
    if (index === -1) {
      createFunction(name, func)
    } else {
      setFunction(index, name, func)
    }
    deactivateModal()
  }

  const footer = (
    <div className="buttons">
      {index === -1 ? (
        <div />
      ) : (
        <button type="button" className="button is-danger" onClick={() => deleteFunction(index)}>{t`Delete`}</button>
      )}
      <span className="button-group">
        <button type="button" className="button is-dark" onClick={deactivateModal}>{t`Cancel`}</button>
        <button type="button" className="button is-primary" onClick={onSave}>{t`Save`}</button>
      </span>
    </div>
  )

  return (
    <ModalCard
      title={t`Add Function`}
      footer={footer}
      className="custom-function-modal"
      onHide={deactivateModal}
      active
    >
      <label>
        {t`Name`}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        {t`Function`}
        <textarea value={func} onChange={e => setFunc(e.target.value)} />
      </label>
    </ModalCard>
  )
}

export default connector(CustomFunctionModal)
