import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { t } from 'ttag'
import CustomFunction from './CustomFunction'
import { toggleFunction } from '../actions/customFunctions'
import CustomFunctionModal from './CustomFunctionModal'

const connector = connect(
  ({ runConfiguration }: { runConfiguration: { customFunctions: any[] } }) => {
    const { customFunctions } = runConfiguration
    return { customFunctions }
  },
  (dispatch: (action: any) => any) => {
    return { onToggleFunction: (value: string) => dispatch(toggleFunction(parseInt(value, 10))) }
  },
)

const CustomFunctions = (props: ConnectedProps<typeof connector>) => {
  const { customFunctions, onToggleFunction } = props
  const [modalActive, setModalActive] = useState(false)
  const [modalIndex, setModalIndex] = React.useState(-1)
  const onChange = (value: string) => {
    if (value === 'addNew') {
      setModalIndex(-1)
      setModalActive(true)
      return
    }
    onToggleFunction(value)
  }

  return (
    <>
      {modalActive && <CustomFunctionModal index={modalIndex} deactivateModal={() => setModalActive(false)} />}
      <table className="table is-fullwidth">
        <thead className="align-bottom is-size-7 has-text-weight-bold">
          <tr>
            <td />
            <th>{t`Name`}</th>
            <th>{t`Value`}</th>
            <th>{t`Transfer Limit (+/-)`}</th>
          </tr>
        </thead>
        <tbody>
          {customFunctions.map((func, index: number) =>
            func.selected ? (
              <CustomFunction
                key={func.name}
                index={index}
                customFunction={func}
                activateModal={() => {
                  setModalIndex(index)
                  setModalActive(true)
                }}
              />
            ) : null,
          )}
        </tbody>
      </table>
      <div className="select is-fullwidth">
        <select
          value=""
          onChange={e => {
            e.preventDefault()
            onChange(e.target.value)
          }}
        >
          <option />
          <option value="addNew">{t`Add a custom function...`}</option>
          {customFunctions.map((f, index) =>
            f.selected ? null : (
              <option value={index} key={`${f.name}_${f.index}`}>
                {f.name}
              </option>
            ),
          )}
        </select>
      </div>
    </>
  )
}

export default connector(CustomFunctions)
