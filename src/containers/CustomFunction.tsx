import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { t } from 'ttag'
import EditableLabel from '../components/EditableLabel'
import { setFunctionTransfer, toggleFunction } from '../actions/customFunctions'

const connector = connect(null, (dispatch: (action: any) => any) => {
  return {
    onTransferChange: (index: number, transfer: string) => dispatch(setFunctionTransfer(index, parseFloat(transfer))),
    onToggleFunction: (index: number) => dispatch(toggleFunction(index)),
  }
})

type FunctionProps = ConnectedProps<typeof connector> & {
  index: number
  customFunction: any
  activateModal: () => void
}

const Function = ({ index, customFunction, activateModal, onTransferChange, onToggleFunction }: FunctionProps) => {
  const { name, func, value, transfer } = customFunction

  return (
    <tr data-tip data-for={`${name}_Tooltip`}>
      <td>
        <a type="button" className="delete" onClick={() => onToggleFunction(index)} />
      </td>
      {/* TODO: Revisit "trait-label" */}
      <td className="trait-label">
        <strong>{name}</strong>
      </td>
      <td>{value}</td>
      <td>
        <EditableLabel value={transfer} onChange={(newValue: string) => onTransferChange(index, newValue)} />
        <ReactTooltip id={`${name}_Tooltip`} className="variable-tooltip" place="right" effect="solid">
          <h5 className="title is-5 margin-bottom-5">{name}</h5>
          {func !== null ? <div className="is-size-7 has-text-grey-lighter">{func}</div> : null}
          <div>
            <span className="tooltip-label">{t`Value:`}</span>
            <strong>{value || '--'}</strong>
          </div>
          <div>
            <span className="tooltip-label">{t`Transfer limit (+/-):`}</span>
            <strong>{transfer}</strong>
          </div>
        </ReactTooltip>
      </td>
      <td>
        <a
          type="button"
          className="icon-more-18"
          onClick={e => {
            e.stopPropagation()
            activateModal()
          }}
        />
      </td>
    </tr>
  )
}

export default connector(Function)
