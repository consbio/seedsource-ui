import config, { regions } from '../config'
import point, { defaultState as defaultPoint } from './point'
import variables from './variables'
import traits from './traits'
import zones from './zones'
import climate from './climate'
import constraints from './constraints'
import { SELECT_OBJECTIVE } from '../actions/objectives'
import {
  SET_LATITUDE,
  SET_LONGITUDE,
  SET_POINT,
  SET_ELEVATION,
  ADD_USER_SITE,
  REMOVE_USER_SITE,
  SET_USER_SITE_SCORE,
  SET_ACTIVE_USER_SITE,
} from '../actions/point'
import { SELECT_SPECIES, RECEIVE_AVAILABLE_SPECIES } from '../actions/species'
import { SELECT_UNIT, SELECT_METHOD, SELECT_CENTER, REMOVE_VARIABLE, SET_DEFAULT_VARIABLES } from '../actions/variables'
import { LOAD_CONFIGURATION, RESET_CONFIGURATION } from '../actions/saves'
import { FINISH_JOB } from '../actions/job'
import { SELECT_STEP } from '../actions/step'
import { REQUEST_REPORT, RECEIVE_REPORT, FAIL_REPORT } from '../actions/report'
import { SELECT_REGION_METHOD, SET_REGION, RECEIVE_REGIONS } from '../actions/region'

export type UserSite = {
  lat: number
  lon: number
  score?: number
}

const defaultConfiguration = {
  objective: 'seedlots',
  species: 'generic',
  availableSpecies: [],
  point: defaultPoint,
  region: null,
  validRegions: [],
  climate: null,
  method: 'custom',
  center: 'point',
  unit: 'metric',
  zones: null,
  regionMethod: 'auto',
  useDefaultVariables: false,
  variables: [],
  traits: [],
  constraints: [],
  userSites: [] as UserSite[],
  activeUserSite: null,
}

export default (state: any = defaultConfiguration, action: any) => {
  const runConfiguration = () => {
    if (action.type === SELECT_METHOD) {
      const newState = { ...state, method: action.method }

      if (action.method === 'seedzone' && !state.availableSpecies.includes(state.species)) {
        newState.species = 'generic'
      } else if (action.method === 'function') {
        let functionSpecies
        if (config.functions.length === 1) {
          functionSpecies = config.functions[0].species
        } else {
          functionSpecies = config.functions.reduce((arr, func) => [...arr, ...func.species], [])
        }
        if (!functionSpecies.includes(state.species)) {
          ;[newState.species] = functionSpecies
        }
      }

      return newState
    }
    if (action.type === SELECT_REGION_METHOD) {
      const newState = { ...state, regionMethod: action.method }

      if (action.method === 'auto') {
        newState.region = newState.validRegions.length ? newState.validRegions[0] : null
      } else if (newState.region === null) {
        newState.region = regions[0].name
      }

      return newState
    }

    switch (action.type) {
      case SELECT_OBJECTIVE:
        return { ...state, objective: action.objective }

      case SET_LATITUDE:
      case SET_LONGITUDE:
      case SET_POINT:
      case SET_ELEVATION:
        return { ...state, point: point(state.point, action) }

      case RECEIVE_AVAILABLE_SPECIES:
        if (!action.species.length || action.species.includes(state.species)) {
          return { ...state, availableSpecies: action.species }
        }
        return { ...state, availableSpecies: action.species, species: action.species[0] }

      case SELECT_SPECIES:
        return { ...state, species: action.species }

      case SELECT_UNIT:
        return { ...state, unit: action.unit }

      case SELECT_CENTER:
        return { ...state, center: action.center }

      case SET_REGION:
        return { ...state, region: action.region }

      case RECEIVE_REGIONS:
        return { ...state, validRegions: action.regions }

      case ADD_USER_SITE:
        return { ...state, userSites: [action.latlon as UserSite, ...state.userSites] }

      case REMOVE_USER_SITE:
        return {
          ...state,
          userSites: [...state.userSites.slice(0, action.index), ...state.userSites.slice(action.index + 1)],
          activeUserSite: null,
        }

      case SET_USER_SITE_SCORE:
        return {
          ...state,
          userSites: state.userSites.map((site: UserSite) => {
            const { lat, lon } = action.latlon
            if (site.lat === lat && site.lon === lon) {
              const { score } = action
              return { ...site, score }
            }
            return { ...site }
          }),
        }

      case SET_ACTIVE_USER_SITE:
        return {
          ...state,
          activeUserSite: action.index,
        }

      case SET_DEFAULT_VARIABLES:
        return { ...state, useDefaultVariables: action.useDefault }

      case REMOVE_VARIABLE:
        return { ...state, useDefaultVariables: false }

      case RESET_CONFIGURATION:
        return defaultConfiguration

      case LOAD_CONFIGURATION:
        return { ...defaultConfiguration, ...action.configuration }

      default:
        return state
    }
  }

  const newState = runConfiguration()

  return {
    ...newState,
    variables: variables(newState.variables, action),
    traits: traits(newState.traits, action),
    zones: zones(newState.zones || undefined, action),
    climate: climate(newState.climate || undefined, action),
    constraints: constraints(newState.constraints, action),
  }
}

export const lastRun = (state = null, action: any) => {
  switch (action.type) {
    case FINISH_JOB:
      return action.configuration

    case LOAD_CONFIGURATION:
      return null

    default:
      return state
  }
}

export const activeStep = (state = 'objective', action: any) => {
  switch (action.type) {
    case SELECT_STEP:
      return action.step

    default:
      return state
  }
}

export const reportIsFetching = (state = false, action: any) => {
  switch (action.type) {
    case REQUEST_REPORT:
      return true

    case RECEIVE_REPORT:
    case FAIL_REPORT:
      return false

    default:
      return state
  }
}
