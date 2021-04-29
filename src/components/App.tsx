import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import ErrorModal from '../containers/ErrorModal'
import Navbar from './Navbar'
import Map from '../containers/Map'
import Comparisons from '../containers/Comparisons'

const App = ({
  navContent,
  children,
  className,
}: {
  navContent: ReactNode
  children?: ReactNode | null
  className?: string
}) => (
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

App.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
}

App.defaultProps = {
  children: null,
  className: '',
}

export default App
