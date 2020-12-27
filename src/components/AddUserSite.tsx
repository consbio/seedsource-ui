import React from 'react'
import { c, t } from 'ttag'

type AddUserSiteProps = {
  onClose: () => any
  onAddUserSite: (lat: number, lon: number, label: string) => any
}

type AddUserSiteState = {
  lat: string
  lon: string
  label: string
}

class AddUserSite extends React.Component<AddUserSiteProps, AddUserSiteState> {
  constructor(props: any) {
    super(props)

    this.state = { lat: '', lon: '', label: '' }
  }

  submit = () => {
    const { lat, lon, label } = this.state
    const { onAddUserSite } = this.props

    const latF = parseFloat(lat)
    const lonF = parseFloat(lon)

    if (latF && lonF) {
      onAddUserSite(latF, lonF, label)
    }
  }

  render() {
    const { onClose } = this.props
    const { lat, lon, label } = this.state

    return (
      <form
        onSubmit={() => {
          this.submit()
          return false
        }}
      >
        <div className="columns is-mobile" style={{ marginBottom: '0' }}>
          <label className="column is-narrow">
            <div>{c("Abbreviation of 'Latitude'").t`Lat`}</div>
            <input
              className="input is-small"
              type="text"
              data-lpignore="true"
              value={lat}
              style={{ width: '80px', textAlign: 'right' }}
              onChange={e => this.setState({ lat: e.target.value })}
            />
          </label>
          <label className="column is-narrow">
            <div>{c("Abbreviation of 'Longitude'").t`Lon`}</div>
            <input
              className="input is-small"
              type="text"
              data-lpignore="true"
              value={lon}
              style={{ width: '80px', textAlign: 'right' }}
              onChange={e => this.setState({ lon: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            <div>Name</div>
            <input
              className="input is-small"
              type="text"
              data-lpignore="true"
              value={label}
              style={{ width: '183px', marginBottom: '24px' }}
              onChange={e => this.setState({ label: e.target.value })}
            />
          </label>
        </div>
        <div style={{ textAlign: 'right', paddingRight: '15px' }}>
          <button
            className="button"
            type="button"
            onClick={() => {
              onClose()
            }}
          >
            {t`Cancel`}
          </button>

          <button
            className="button is-primary"
            type="submit"
            style={{ marginLeft: '10px' }}
            disabled={!(parseFloat(lat) && parseFloat(lon))}
          >
            {c("e.g., 'Add to list'").t`Add`}
          </button>
        </div>
      </form>
    )
  }
}

export default AddUserSite
