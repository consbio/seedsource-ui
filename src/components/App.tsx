import React from 'react'
import PropTypes from 'prop-types'

const App = ({ children, className }: any) => (
  <div className={`seedsource-app ${className}`}>{children}</div>
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
