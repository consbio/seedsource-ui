import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { t, c } from 'ttag'
import { loadConfiguration, resetConfiguration, deleteSave, dumpConfiguration } from '../actions/saves'
import { migrateConfiguration } from '../utils'
import config from '../config'
import { post } from '../io'

const connector = connect(null, (dispatch: (event: any) => any, { onClick }: { onClick: () => any }) => {
  return {
    onClick: () => {
      onClick()
    },

    onLoad: (save: any) => {
      dispatch(resetConfiguration())
      const migratedConfiguration = migrateConfiguration(save.configuration, save.version)

      /* In some cases where the loaded configuration is similar to the previous one, certain events aren't
       * fired if the event is dispatched in the same event cycle as the reset event
       */
      setTimeout(() => dispatch(loadConfiguration(migratedConfiguration, save)), 0)
    },

    onDelete: (saveId: string) => {
      dispatch(deleteSave(saveId))
    },

    onGetURL: (configuration: any, version: number) => {
      const url = `${config.apiRoot}share-url/`
      const data = {
        configuration: JSON.stringify(dumpConfiguration(configuration)),
        version,
      }
      post(url, data)
        .then(response => {
          const { status } = response
          console.log('response', response)
          if (status >= 200 && status < 300) {
            return response.json()
          }

          throw new Error(`Bad status creating save: ${response.status}`)
        })
        .then(json => {
          console.log('json', json)
          // setUrl(json)
        })
    },
  }
})

type SavedRunProps = ConnectedProps<typeof connector> & {
  active: boolean
  save: any
}

const SavedRun = ({ active, save, onClick, onLoad, onDelete, onGetURL }: SavedRunProps) => {
  let className = 'configuration-item'
  const { modified, title } = save
  const [url, setUrl] = useState('')

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
      <div className="save-title">{title}</div>
      <div className="save-date">
        {t`Last modified:`} {modified.getMonth() + 1}/{modified.getDate()}/{modified.getYear()}
      </div>
      <div className="buttons">
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t`Load this saved configuration? This will replace your current settings.`)) {
              onLoad(save)
            }
          }}
          className="button is-primary"
        >
          <span className="icon-load-12" aria-hidden="true" /> &nbsp;{c('e.g., Load file').t`Load`}
        </button>
        <button type="button" onClick={() => onGetURL(save.configuration, save.version)} className="button is-warning">
          <span className="icon-share-12" aria-hidden="true" /> &nbsp;{t`Get URL`}
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t`Delete this saved configuration?`)) {
              onDelete(save.uuid)
            }
          }}
          className="button is-danger"
        >
          <span className="icon-trash-12" aria-hidden="true" /> &nbsp;{t`Delete`}
        </button>
      </div>
    </div>
  )
}

export default connector(SavedRun)
