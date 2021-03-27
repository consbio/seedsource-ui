import React from 'react'
import { connect } from 'react-redux'
import { t, c, jt } from 'ttag'
import ConfigurationStep from './ConfigurationStep'
import PointChooser from './PointChooser'
import AddUserSite from '../components/AddUserSite'
import UserSites from './UserSites'
import { setMapMode } from '../actions/map'
import { addUserSite } from '../actions/point'

type LocationStepProps = {
  objective: string
  number: number
  elevation?: any
  mode: string
  onSetMapMode: (mode: string) => any
  onAddUserSite: (lat: number, lon: number, label: string) => any
}

const LocationStep = ({ objective, number, elevation, mode, onSetMapMode, onAddUserSite }: LocationStepProps) => {
  const flag = (window as any).waffle.flag_is_active('map-seedlots')

  const elevationNode =
    elevation !== null ? (
      <div>
        <div>
          <strong>{t`Elevation:`}</strong> {Math.round(elevation.ft)} ft ({Math.round(elevation.m)} m)
        </div>
      </div>
    ) : (
      elevation
    )

  const siteLabel =
    objective === 'sites' ? c('siteLabel').t`seedlot (its climatic center)` : c('siteLabel').t`planting site`
  const locationLabel = objective === 'seedlots' ? c('locationLabel').t`Seedlots` : c('locationLabel').t`Planting Sites`

  return (
    <ConfigurationStep
      title={objective === 'seedlots' ? t`Select planting site location` : t`Select seedlot location`}
      number={number}
      name="location"
      active
    >
      {flag ? (
        <>
          <div className="columns">
            <div className="column is-narrow" style={{ width: '185px' }}>
              <h4 className="title is-6" style={{ marginBottom: '0' }}>
                {t`Location`}
              </h4>
              <div className="is-size-7 is-italic">
                {jt`Locate your ${siteLabel} by using the map or entering coordinates.`}
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
                {jt`Map ${locationLabel}`}
              </h4>
              <div className="is-size-7 is-italic">
                {(() => {
                  const plotLabel =
                    objective === 'seedlots' ? c('plotLabel').t`seedlots` : c('plotLabel').t`planting sites`

                  return jt`Optional. Plot ${plotLabel} on the map for comparison.`
                })()}
              </div>
            </div>
            <div className="column">
              {mode === 'add_sites' ? (
                <AddUserSite
                  onClose={() => {
                    onSetMapMode('normal')
                  }}
                  onAddUserSite={onAddUserSite}
                />
              ) : (
                <button
                  className="button is-primary"
                  type="button"
                  onClick={() => {
                    onSetMapMode('add_sites')
                  }}
                >
                  {jt`Add ${locationLabel}`}
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
              <em>{jt`Locate your ${siteLabel}`}</em>
            </div>
            <div>
              <em>{t`Use the map or enter coordinates`}</em>
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
    onSetMapMode: (mode: string) => dispatch(setMapMode(mode)),
    onAddUserSite: (lat: number, lon: number, label: string) => {
      dispatch(addUserSite({ lat, lon }, label))
      dispatch(setMapMode('normal'))
    },
  }),
)(LocationStep)
