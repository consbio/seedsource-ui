import React from 'react'
import { connect } from 'react-redux'
import ConfigurationStep from './ConfigurationStep'
import PointChooser from './PointChooser'
import AddUserSite from '../components/AddUserSite'
import UserSites from './UserSites'
import { setMapMode as _setMapMode } from '../actions/map'
import { addUserSite as _addUserSite } from '../actions/point'

type LocationStepProps = {
  objective: string
  number: number
  elevation?: any
  mode: string
  setMapMode: (mode: string) => any
  addUserSite: (lat: number, lon: number, label: string) => any
}

const LocationStep = ({ objective, number, elevation, mode, setMapMode, addUserSite }: LocationStepProps) => {
  const flag = (window as any).waffle.flag_is_active('map-seedlots')

  const elevationNode =
    elevation !== null ? (
      <div>
        <div>
          <strong>Elevation:</strong> {Math.round(elevation.ft)} ft ({Math.round(elevation.m)} m)
        </div>
      </div>
    ) : (
      elevation
    )

  return (
    <ConfigurationStep
      title={objective === 'seedlots' ? 'Select planting site location' : 'Select seedlot location'}
      number={number}
      name="location"
      active
    >
      {flag ? (
        <>
          <div className="columns">
            <div className="column is-narrow" style={{ width: '185px' }}>
              <h4 className="title is-6" style={{ marginBottom: '0' }}>
                Location
              </h4>
              <div className="is-size-7 is-italic">
                Locate your {objective === 'sites' ? 'seedlot (its climatic center)' : 'planting site'} by using the map
                or entering coordinates.
              </div>
            </div>
            <div className="column">
              <PointChooser />
              {elevationNode}
            </div>
          </div>
          <div className="columns">
            <div className="column is-narrow" style={{ width: '185px' }}>
              <h4 className="title is-6" style={{ marginBottom: '0' }}>
                Map {objective === 'seedlots' ? 'Seedlots' : 'Planting Sites'}
              </h4>
              <div className="is-size-7 is-italic">
                Optional. Plot {objective === 'seedlots' ? 'planting sites' : 'seedlots'} on the map for comparison.
              </div>
            </div>
            <div className="column">
              {mode === 'add_sites' ? (
                <AddUserSite
                  onClose={() => {
                    setMapMode('normal')
                  }}
                  onAddUserSite={addUserSite}
                />
              ) : (
                <button
                  className="button is-primary"
                  type="button"
                  onClick={() => {
                    setMapMode('add_sites')
                  }}
                >
                  Add {objective === 'seedlots' ? 'Seedlots' : 'Planting Sites'}
                </button>
              )}
            </div>
          </div>
          <UserSites />
        </>
      ) : (
        <>
          <div className="is-size-7">
            <div>
              <em>Locate your {objective === 'sites' ? 'seedlot (its climatic center' : 'planting site'}</em>
            </div>
            <div>
              <em>Use the map or enter coordinates</em>
            </div>
          </div>

          <div>&nbsp;</div>

          <PointChooser />
          {elevationNode !== null ? <div>&nbsp;</div> : null}
          {elevationNode}
        </>
      )}
    </ConfigurationStep>
  )
}

LocationStep.shouldRender = () => true

LocationStep.defaultProps = {
  elevation: null,
}

export default connect(
  ({ runConfiguration, map }: { runConfiguration: any; map: any }) => {
    const { mode } = map
    const { objective, point } = runConfiguration
    let { elevation } = point

    if (elevation !== null) {
      elevation = { ft: elevation / 0.3048, m: elevation }
    }

    return { objective, point, elevation, mode }
  },
  dispatch => ({
    setMapMode: (mode: string) => dispatch(_setMapMode(mode)),
    addUserSite: (lat: number, lon: number, label: string) => dispatch(_addUserSite({ lat, lon }, label )),
  }),
)(LocationStep)
