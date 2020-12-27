import React from 'react'
import { connect } from 'react-redux'
import { t, c } from 'ttag'
import { removeUserSite, setActiveUserSite, setUserSiteLabel } from '../actions/point'
import { UserSite as UserSiteType } from '../reducers/runConfiguration'

type UserSitesProps = {
  userSites: any[]
  removeSite: (index: number) => any
  setActiveSite: (index: number | null) => any
  setUserSiteLabel: (label: string, index: number) => any
}

// custom input element gets focus when mounted
const NameInput = ({
  label,
  index,
  setUserSiteLabel,
  setIsEditingName,
}: {
  label: string
  index: number
  setUserSiteLabel: (label: string, index: number) => any
  setIsEditingName: (nameIndex: number | null) => any
}) => {
  const nameInputRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus()
  }, [])
  return (
    <input
      ref={nameInputRef}
      className="input is-small"
      type="text"
      value={label || ''}
      onChange={e => setUserSiteLabel(e.target.value, index)}
      onKeyDown={(e: any) => {
        if (e.key === 'Enter') {
          setIsEditingName(null)
        }
      }}
      onBlur={() => setIsEditingName(null)}
    />
  )
}

const UserSite = ({ userSites, removeSite, setActiveSite, setUserSiteLabel }: UserSitesProps) => {
  const [isEditingName, setIsEditingName] = React.useState<number | null>(null)
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
        <tr>
          <td />
          <th>Name</th>
          <th>Location</th>
          <th>Similarity</th>
        </tr>
      </thead>
      <tbody>
        {userSites.map(({ lat, lon, score, label }, index) => (
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
            {isEditingName === index ? (
              <td>
                <NameInput
                  label={label}
                  index={index}
                  setUserSiteLabel={setUserSiteLabel}
                  setIsEditingName={setIsEditingName}
                />
              </td>
            ) : (
              <td style={{ cursor: 'pointer' }} onClick={() => setIsEditingName(index)}>
                {label ? (
                  <div style={{ maxWidth: '134px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
                ) : (
                  <div style={{ fontStyle: 'italic', color: 'gray' }}>click to add</div>
                )}
              </td>
            )}
            <td>
              <strong>
                {lat}, {lon}
              </strong>
            </td>
            <td>{score === undefined ? c('i.e., Not Applicable').t`N/A` : `${score}%`}</td>
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
      userSites: userSites.map(({ lat, lon, score, label }: UserSiteType) => ({
        lat: lat.toFixed(2),
        lon: lon.toFixed(2),
        score,
        label,
      })),
    }
  },
  dispatch => ({
    removeSite: (index: number) => dispatch(removeUserSite(index)),
    setActiveSite: (index: number | null) => dispatch(setActiveUserSite(index)),
    setUserSiteLabel: (label: string, index: number) => dispatch(setUserSiteLabel(label, index)),
  }),
)(UserSite)
