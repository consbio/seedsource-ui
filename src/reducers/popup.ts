import {
  SET_POPUP_LOCATION,
  RESET_POPUP_LOCATION,
  REQUEST_POPUP_VALUE,
  RECEIVE_POPUP_VALUE,
  RECEIVE_POPUP_ELEVATION,
  REQUEST_POPUP_REGION,
  RECEIVE_POPUP_REGION,
} from '../actions/popup'
import { REMOVE_VARIABLE, ADD_VARIABLE } from '../actions/variables'
import { LOAD_CONFIGURATION } from '../actions/saves'

const defaultState = {
  point: null,
  isFetchingElevation: false,
  elevation: null,
  values: [],
  region: null,
}

export default (state: any = defaultState, action: any) => {
  const updateValue = (name: string, props: any) => {
    const { values } = state
    const index = values.findIndex((item: any) => item.name === name)

    if (index === -1) {
      return state
    }

    const value = { ...values[index], ...props }
    return { ...state, values: values.slice(0, index).concat([value, ...values.slice(index + 1)]) }
  }

  switch (action.type) {
    case SET_POPUP_LOCATION:
      return {
        ...state,
        point: { x: action.lon, y: action.lat },
        elevation: null,
        values: state.values.map((item: any) => {
          return { ...item, value: null }
        }),
      }

    case RESET_POPUP_LOCATION:
      return {
        ...defaultState,
        values: state.values.map((item: any) => {
          return { ...item, value: null }
        }),
      }

    case REQUEST_POPUP_VALUE:
      return updateValue(action.variable, { isFetching: true, value: null })

    case RECEIVE_POPUP_VALUE:
      return updateValue(action.variable, { isFetching: false, value: action.value })

    case REMOVE_VARIABLE:
      return { ...state, values: state.values.slice(0, action.index).concat(state.values.slice(action.index + 1)) }

    case ADD_VARIABLE:
      return { ...state, values: [...state.values, { name: action.variable, value: null }] }

    case RECEIVE_POPUP_ELEVATION:
      return { ...state, elevation: action.elevation }

    case REQUEST_POPUP_REGION:
      return { ...state, region: null }

    case RECEIVE_POPUP_REGION:
      return { ...state, region: action.region }

    case LOAD_CONFIGURATION:
      return defaultState

    default:
      return state
  }
}
