import React from 'react'
import { connect } from 'react-redux'
import { removeUserSite, setActiveUserSite } from '../actions/point'
import { UserSite as UserSiteType } from '../reducers/runConfiguration'

type UserSitesProps = {
  userSites: any[]
  removeSite: (index: number) => any
  setActiveSite: (index: number | null) => any
}

const UserSite = ({ userSites, removeSite, setActiveSite }: UserSitesProps) => {
  if (!userSites.length) {
    return null
  }

  return (
    <table
      className="table"
      style={{ lineHeight: '20px' }}
      onMouseOut={() => {
        setActiveSite(null)
      }}
      onBlur={() => setActiveSite(null)}
    >
      <thead>
        <td />
        <th>Location</th>
        <th>Similarity</th>
      </thead>
      <tbody>
        {userSites.map(({ lat, lon, score }, index) => (
          <tr
            key={`${lat}-${lon}`}
            onMouseOver={() => {
              setActiveSite(index)
            }}
            onFocus={() => setActiveSite(index)}
          >
            <td className="is-narrow">
              <button type="button" className="delete" onClick={() => removeSite(index)} aria-label="Remove site" />
            </td>
            <td>
              <strong>
                {lat}, {lon}
              </strong>
            </td>
            <td>{score === undefined ? 'N/A' : `${score}%`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default connect(
  ({ runConfiguration }: { runConfiguration: any }) => {
    const { userSites } = runConfiguration
    return {
      userSites: userSites.map(({ lat, lon, score }: UserSiteType) => ({
        lat: lat.toFixed(2),
        lon: lon.toFixed(2),
        score,
      })),
    }
  },
  dispatch => ({
    removeSite: (index: number) => dispatch(removeUserSite(index)),
    setActiveSite: (index: number | null) => dispatch(setActiveUserSite(index)),
  }),
)(UserSite)
