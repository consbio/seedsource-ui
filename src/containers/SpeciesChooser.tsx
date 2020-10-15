import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { selectSpecies } from '../actions/species'
import config from '../config'

const { species: speciesList, functions } = config

const connector = connect(
  ({ runConfiguration }: { runConfiguration: any }) => {
    let { availableSpecies } = runConfiguration
    const { species, method } = runConfiguration

    if (method === 'function') {
      let functionSpecies: any[]
      if (functions.length === 1) {
        functionSpecies = functions[0].species
      } else {
        functionSpecies = functions.reduce((arr, func) => [...arr, ...func.species], [])
      }
      availableSpecies = speciesList.filter(item => functionSpecies.includes(item.name)).map(item => item.name)
    }

    return { method, species, availableSpecies }
  },
  (dispatch: (event: any) => any) => {
    return {
      onSpeciesChange: (species: string) => {
        dispatch(selectSpecies(species))
      },
    }
  },
)

type SpeciesChooserProps = ConnectedProps<typeof connector> & {
  generic?: boolean
}

const SpeciesChooser = ({ species, generic, onSpeciesChange, availableSpecies }: SpeciesChooserProps) => {
  const availableSpeciesList = speciesList.filter(item => availableSpecies.includes(item.name))

  return (
    <div>
      <h5 className="title is-5 is-marginless">Select a species</h5>
      <div className="select">
        <select
          value={species}
          onChange={e => {
            e.preventDefault()
            onSpeciesChange(e.target.value)
          }}
        >
          {generic ? <option value="generic">Generic</option> : null}

          {availableSpeciesList.map(item => (
            <option value={item.name} key={item.name}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

SpeciesChooser.defaultProps = {
  generic: true,
}

export default connector(SpeciesChooser)
