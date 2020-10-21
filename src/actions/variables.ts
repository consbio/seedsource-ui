export const SELECT_UNIT = 'SELECT_UNIT'
export const SELECT_METHOD = 'SELECT_METHOD'
export const SELECT_CENTER = 'SELECT_CENTER'
export const SELECT_SEEDZONE = 'SELECT_SEEDZONE'
export const ADD_VARIABLE = 'ADD_VARIABLE'
export const REMOVE_VARIABLE = 'REMOVE_VARIABLE'
export const MODIFY_VARIABLE = 'MODIFY_VARIABLE'
export const RESET_TRANSFER = 'RESET_TRANSFER'
export const RECEIVE_VALUE = 'RECEIVE_VALUE'
export const REQUEST_VALUE = 'REQUEST_VALUE'
export const RECEIVE_TRANSFER = 'RECEIVE_TRANSFER'
export const REQUEST_TRANSFER = 'REQUEST_TRANSFER'
export const SET_VARIABLES_REGION = 'SET_VARIABLES_REGION'

export const selectUnit = (unit: string) => {
  return {
    type: SELECT_UNIT,
    unit,
  }
}

export const selectMethod = (method: string) => {
  return {
    type: SELECT_METHOD,
    method,
  }
}

export const selectCenter = (center: string) => {
  return {
    type: SELECT_CENTER,
    center,
  }
}

export const selectSeedzone = (seedzone: number) => {
  return {
    type: SELECT_SEEDZONE,
    seedzone,
  }
}

export const addVariable = (variable: string) => {
  return {
    type: ADD_VARIABLE,
    variable,
  }
}

export const removeVariable = (variable: string, index: number) => {
  return {
    type: REMOVE_VARIABLE,
    variable,
    index,
  }
}

export const modifyVariable = (variable: string, transfer: number) => {
  return {
    type: MODIFY_VARIABLE,
    variable,
    transfer,
  }
}

export const resetTransfer = (variable: string) => {
  return {
    type: RESET_TRANSFER,
    variable,
  }
}

export const receiveValue = (variable: string, json: any) => {
  let value = null
  if (json.results.length) {
    value = json.results[0].attributes['Pixel value']
  }

  return {
    type: RECEIVE_VALUE,
    value,
    variable,
  }
}

export const requestValue = (variable: string) => {
  return {
    type: REQUEST_VALUE,
    variable,
  }
}

export const receiveTransfer = (
  variable: string,
  transfer: number | null,
  avgTransfer: number | null,
  center: number | null,
) => {
  return {
    type: RECEIVE_TRANSFER,
    transfer,
    avgTransfer,
    center,
    variable,
  }
}

export const requestTransfer = (variable: string) => {
  return {
    type: REQUEST_TRANSFER,
    variable,
  }
}

export const setVariablesRegion = (region: string) => {
  return {
    type: SET_VARIABLES_REGION,
    region,
  }
}
