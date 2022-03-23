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
      get(`${config.apiRoot}share-urls/${save}`)
        .then(response => {
          const { status } = response
          if (status >= 200 && status < 300) {
            return response.json()
          }
        })
        .then(json => {
          const configuration = JSON.parse(json.configuration)
          const migratedConfiguration = migrateConfiguration(configuration, json.version)
          dispatch(loadConfiguration(migratedConfiguration, null))
        })
    }
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
