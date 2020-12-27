import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { t } from 'ttag'
import { selectZone } from '../actions/zones'

const connector = connect(
  ({ runConfiguration }: { runConfiguration: any }) => {
    const { method, species, point, zones } = runConfiguration
    const { selected, matched, isFetchingZones } = zones

    const pointIsValid = point !== null && point.x !== null && point.y !== null && point.x !== '' && point.y !== ''

    return {
      zones: matched,
      species,
      selected,
      method,
      pointIsValid,
      isFetchingZones,
    }
  },
  (dispatch: (event: any) => any) => {
    return {
      onZoneChange: (zone: string) => {
        dispatch(selectZone(zone))
      },
    }
  },
)

const getZoneLabel = (zone?: any) => {
  if (zone === undefined) {
    return null
  }

  let label = zone.name

  if (zone.elevation_band && zone.elevation_band.length > 2) {
    label += ` ${zone.elevation_band[2]}`
  } else if (zone.elevation_band) {
    label += `, ${zone.elevation_band[0]}' - ${zone.elevation_band[1]}'`
  }

  return label
}

const SeedZoneChooser = ({
  method,
  selected,
  zones,
  pointIsValid,
  isFetchingZones,
  onZoneChange,
}: ConnectedProps<typeof connector>) => {
  if (method !== 'seedzone') {
    return null
  }

  const noZoneLabel = pointIsValid ? t`No zones at this location...` : t`Select a location...`

  let content = (
    <div className="select">
      <select disabled>
        <option>{noZoneLabel}</option>
      </select>
    </div>
  )

  if (zones.length) {
    content = (
      <div className="select">
        <select
          value={selected}
          disabled={isFetchingZones}
          onChange={e => {
            e.preventDefault()
            onZoneChange(e.target.value)
          }}
        >
          {zones.map((item: any) => (
            <option value={item.zone_uid} key={item.id}>
              {getZoneLabel(item)}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div>
      <h5 className="title is-5 is-marginless">{t`Select zone`}</h5>
      {content}
    </div>
  )
}

export default connector(SeedZoneChooser)
