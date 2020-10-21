import React from 'react'
import config from '../config'
import AccountMenu from '../containers/AccountMenu'

type NavbarState = {
  isActive: boolean
}

class Navbar extends React.Component<{}, NavbarState> {
  constructor(props: any) {
    super(props)
    this.state = { isActive: false }
  }

  render() {
    const { logo, runtime, navbarClass = '' } = config
    const { title } = runtime
    const { children } = this.props
    const { isActive } = this.state
    const active = isActive ? 'is-active' : ''

    return (
      <nav
        className={[active, 'navbar', navbarClass || 'is-dark'].join(' ')}
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <div className="navbar-item">
            {logo !== null ? <img src={logo} className="image is-24x24 margin-right-5" alt={title} /> : null}
            <span className="is-size-4 is-size-5-mobile has-text-weight-bold">{title}</span>
          </div>
          <div
            className={`${active} navbar-burger is-light`}
            onClick={() => {
              this.setState({ isActive: !isActive })
            }}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={`${active} navbar-menu is-size-7-desktop is-size-6-widescreen is-size-6-touch`}>
          <div className="navbar-end">
            {children}
            <AccountMenu />
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
