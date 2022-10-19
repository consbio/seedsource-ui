import {
  CREATE_FUNCTION,
  DELETE_FUNCTION,
  TOGGLE_FUNCTION,
  SET_FUNCTION,
  SET_FUNCTION_TRANSFER,
  SET_FUNCTION_VALUE,
} from '../actions/customFunctions'

export default (state: any = [], action: any) => {
  switch (action.type) {
    case CREATE_FUNCTION:
      return [...state, { name: action.name, func: action.func, value: null, transfer: null, selected: true }]
    case DELETE_FUNCTION:
      return state.slice(0, action.index).concat(state.slice(action.index + 1))
    case TOGGLE_FUNCTION:
      return state
        .slice(0, action.index)
        .concat([{ ...state[action.index], selected: !state[action.index].selected }, ...state.slice(action.index + 1)])
    case SET_FUNCTION:
      return state
        .slice(0, action.index)
        .concat([{ ...state[action.index], name: action.name, func: action.func }, ...state.slice(action.index + 1)])
    case SET_FUNCTION_TRANSFER:
      return state
        .slice(0, action.index)
        .concat([{ ...state[action.index], transfer: action.transfer }, ...state.slice(action.index + 1)])
    case SET_FUNCTION_VALUE:
      return state
        .slice(0, action.index)
        .concat([{ ...state[action.index], value: action.value }, ...state.slice(action.index + 1)])
    default:
      return state
  }
}
