import produce from 'immer'

import { NOT_STARTED, LOADING, SUCCESS, ERROR } from './constants'

const handleAction = (state, action) => {
  const { type, payload, selector } = action

  const matchesStart = /(.*)_REQUEST/.exec(type)
  const matchesError = /(.*)_ERROR/.exec(type)
  const matchesReset = /(.*)_RESET/.exec(type)
  const matchesSuccess = /(.*)_SUCCESS/.exec(type)

  let status = NOT_STARTED
  let key = null
  let promise
  let data
  let externalReducer
  let errorMessage

  if (matchesStart) {
    const [, requestName] = matchesStart
    ; ({ promise } = action)
    externalReducer = !!selector
    key = requestName
    status = LOADING
  } else if (matchesReset) {
    const [, requestName] = matchesReset
    key = requestName
    status = NOT_STARTED
  } else if (matchesError) {
    const [, requestName] = matchesError
    errorMessage = payload
    key = requestName
    status = ERROR
  } else if (matchesSuccess) {
    const [, requestName] = matchesSuccess
    key = requestName
    if (!state[key].externalReducer) data = payload
    status = SUCCESS
  }

  if (key) state[key] = { data, status, errorMessage, promise, externalReducer }

  return state
}

export default (state = {}, action) => produce(state, draft => handleAction(draft, action))
