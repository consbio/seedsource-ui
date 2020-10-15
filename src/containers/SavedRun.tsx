import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { loadConfiguration, resetConfiguration, deleteSave } from '../actions/saves'

const connector = connect(null, (dispatch: (event: any) => any, { onClick }: { onClick: () => any }) => {
  return {
    onClick: () => {
      onClick()
    },

    onLoad: (save: any) => {
      dispatch(resetConfiguration())

      /* In some cases where the loaded configuration is similar to the previous one, certain events aren't
       * fired if the event is dispatched in the same event cycle as the reset event
       */
      setTimeout(() => dispatch(loadConfiguration(save.configuration, save)), 0)
    },

    onDelete: (saveId: string) => {
      dispatch(deleteSave(saveId))
    },
  }
})

type SavedRunProps = ConnectedProps<typeof connector> & {
  active: boolean
  save: any
}

const SavedRun = ({ active, save, onClick, onLoad, onDelete }: SavedRunProps) => {
  let className = 'configuration-item'
  const { modified, title } = save

  if (active) {
    className += ' focused'
  }

  return (
    <div
      className={className}
      onClick={() => {
        onClick()
      }}
    >
      <div className="is-pulled-right buttons">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Load this saved configuration? This will replace your current settings.')) {
              onLoad(save)
            }
          }}
          className="button is-primary"
        >
          <span className="icon-load-12" aria-hidden="true" /> Load
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Delete this saved configuration?')) {
              onDelete(save.uuid)
            }
          }}
          className="button is-danger"
        >
          <span className="icon-trash-12" aria-hidden="true" /> Delete
        </button>
      </div>
      <div className="save-title">{title}</div>
      <div className="save-date">
        Last modified: {modified.getMonth() + 1}/{modified.getDate()}/{modified.getYear()}
      </div>
      <div className="clear-fix" />
    </div>
  )
}

export default connector(SavedRun)
