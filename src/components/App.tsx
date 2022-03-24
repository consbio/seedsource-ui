import React, { ReactNode, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import ErrorModal from '../containers/ErrorModal'
import Navbar from './Navbar'
import Map from '../containers/Map'
import Comparisons from '../containers/Comparisons'
import { loadConfiguration } from '../actions/saves'
import { migrateConfiguration } from '../utils'
import { get } from '../io'
import config from '../config'
import { setError } from '../actions/error'

const App = ({
  navContent,
  children,
  className,
}: {
  navContent: ReactNode
  children?: ReactNode | null
  className?: string
}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const save = params.get('s')
    if (save) {
      get(`${config.apiRoot}share-urls/${save}`).then(response => {
        const { status, statusText } = response
        if (status >= 200 && status < 300) {
          response.json().then(json => {
            const configuration = JSON.parse(json.configuration)
            const migratedConfiguration = migrateConfiguration(configuration, json.version)
            dispatch(loadConfiguration(migratedConfiguration, null))
          })
        } else {
          const dispatchError = (text: any) => {
            const debugInfo = (
              <>
                <div><strong>What was happening:</strong> Retrieving share URL</div>
                <div><strong>Status:</strong> {status}</div>
                <div><strong>Status text:</strong> {statusText}</div>
                <div>
                  <div><strong>Response body:</strong></div>
                  <div>{text}</div>
                </div>
              </>
            )
            dispatch(setError('Error', 'There was a problem loading state from your URL.', debugInfo))
          }
          response
            .text()
            .then(text => {
              dispatchError(text)
            })
            .catch(() => {
              dispatchError(null)
            })
        }
      })
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className={`seedsource-app ${className}`}>
      <div id="modal-portal" />
      <ErrorModal />
      <Navbar>{navContent}</Navbar>

      <div className="columns is-gapless">
        <div className="column is-narrow sidebar">{children}</div>
        <div className="column map">
          <Map />
          <Comparisons />
        </div>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
}

App.defaultProps = {
  children: null,
  className: '',
}

export default App
