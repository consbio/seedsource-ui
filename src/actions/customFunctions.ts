export const CREATE_FUNCTION = 'CREATE_FUNCTION'
export const DELETE_FUNCTION = 'DELETE_FUNCTION'
export const TOGGLE_FUNCTION = 'TOGGLE_FUNCTION'
export const SET_FUNCTION = 'SET_FUNCTION'
export const SET_FUNCTION_TRANSFER = 'SET_FUNCTION_TRANSFER'
export const SET_FUNCTION_VALUE = 'SET_FUNCTION_VALUE'

export const createFunction = (name: string, func: string) => {
  return {
    type: CREATE_FUNCTION,
    name,
    func,
  }
}

export const deleteFunction = (index: number) => {
  return {
    type: DELETE_FUNCTION,
    index,
  }
}

export const toggleFunction = (index: number) => {
  return {
    type: TOGGLE_FUNCTION,
    index,
  }
}

export const setFunction = (index: number, name: string, func: string) => {
  return {
    type: SET_FUNCTION,
    index,
    name,
    func,
  }
}

export const setFunctionTransfer = (index: number, transfer: number) => {
  return {
    type: SET_FUNCTION_TRANSFER,
    index,
    transfer,
  }
}

export const setFunctionValue = (index: number, value: number | null) => {
  return {
    type: SET_FUNCTION_VALUE,
    index,
    value,
  }
}
