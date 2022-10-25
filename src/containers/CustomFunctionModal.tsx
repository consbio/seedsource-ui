import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { variables } from '../config'
import ModalCard from '../components/ModalCard'
import {
  createFunction as createFunctionConnect,
  deleteFunction as deleteFunctionConnect,
  setFunction as setFunctionConnect,
} from '../actions/customFunctions'
import parser, { getNames } from '../parser'
import type { CustomFunction } from '../reducers/customFunctions'

interface CustomFunctionModalProps {
  customFunction: CustomFunction
  deactivateModal: () => void
  createFunction: (name: string, func: string) => void
  setFunction: (id: string, name: string, func: string) => void
  deleteFunction: (id: string) => void
}

interface CustomFunctionModalState {
  name: string
  func: string
  nameError: string
  funcError: string
}

class CustomFunctionModal extends Component<CustomFunctionModalProps, CustomFunctionModalState> {
  nameRef: React.RefObject<HTMLInputElement>

  funcRef: React.RefObject<HTMLTextAreaElement>

  constructor(props: CustomFunctionModalProps) {
    super(props)
    const { customFunction: cf } = this.props

    this.nameRef = createRef()
    this.funcRef = createRef()
    this.state = {
      name: cf ? cf.name : '',
      func: cf ? cf.func : '',
      nameError: '',
      funcError: '',
    }
  }

  componentDidMount() {
    if (this.nameRef.current) {
      this.nameRef.current.focus()
    }
  }

  validateName = () => {
    const { name } = this.state
    if (!name) {
      this.setState({ nameError: t`Please name your function` })
      return false
    }
    return true
  }

  validateFunc = () => {
    const { func } = this.state
    let functionVariables: string[] = []
    const setGenericError = () => this.setState({ funcError: t`There was an error with your function.` })

    try {
      functionVariables = getNames(func)
    } catch (err) {
      console.error(err)
      setGenericError()
      return false
    }

    if (functionVariables.length === 0) {
      this.setState({ funcError: t`You need to include at least one variable in your function.` })
      return false
    }

    const variableNames = variables.map(v => v.name)
    const invalidVariables: string[] = []
    functionVariables.forEach(v => {
      if (![...variableNames, 'math_e', ...invalidVariables].includes(v)) {
        invalidVariables.push(v)
      }
    })
    if (invalidVariables.length === 1) {
      this.setState({ funcError: `"${invalidVariables[0]}" ${t`is not a known variable`}` })
      return false
    }
    if (invalidVariables.length > 1) {
      this.setState({ funcError: `"${invalidVariables.join(', ')}" ${t`are not known variables`}` })
      return false
    }

    // sets each variable to `2` and parses function to catch parsing errors
    try {
      const context: any = {}
      functionVariables.forEach(variable => {
        context[variable] = 2
      })
      parser(func, context)
    } catch (err) {
      console.error(err)
      setGenericError()
      return false
    }

    return true
  }

  onSave = () => {
    const { customFunction, deactivateModal, createFunction, setFunction } = this.props
    const { validateName, validateFunc } = this
    const { name, func } = this.state

    if (!validateName() || !validateFunc()) {
      return
    }

    if (!customFunction) {
      createFunction(name, func)
    } else {
      setFunction(customFunction.id, name, func)
    }

    deactivateModal()
  }

  onDelete = () => {
    const { customFunction, deactivateModal, deleteFunction } = this.props

    deleteFunction(customFunction.id)
    deactivateModal()
  }

  render() {
    const { name, func, nameError, funcError } = this.state
    const { customFunction, deactivateModal } = this.props
    const { onSave, onDelete } = this

    const footer = (
      <div className="buttons">
        {customFunction && customFunction.id ? (
          <button type="button" className="button is-danger" onClick={onDelete}>{t`Delete`}</button>
        ) : (
          <div />
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
          <div className="error">{nameError}</div>
          <input
            value={name}
            ref={this.nameRef}
            onChange={e => {
              this.setState({ name: e.target.value })
              this.setState({ nameError: '' })
            }}
            onKeyPress={e => {
              if (e.key === 'Enter' && this.funcRef.current) {
                this.funcRef.current.focus()
              }
            }}
          />
        </label>
        <label>
          {t`Function`}
          <div className="error">{funcError}</div>
          <textarea
            value={func}
            ref={this.funcRef}
            onChange={e => {
              // strips everything not understood by the parser except spaces
              const formatted = e.target.value.replace(/[^A-Za-z0-9 */_+\-(.)]/g, '')
              this.setState({ func: formatted })
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                return onSave()
              }
              this.setState({ funcError: '' })
            }}
          />
        </label>
      </ModalCard>
    )
  }
}

export default connect(null, (dispatch: (action: any) => any) => {
  return {
    createFunction: (name: string, func: string) => dispatch(createFunctionConnect(name, func)),
    setFunction: (id: string, name: string, func: string) => dispatch(setFunctionConnect(id, name, func)),
    deleteFunction: (id: string) => dispatch(deleteFunctionConnect(id)),
  }
})(CustomFunctionModal)
