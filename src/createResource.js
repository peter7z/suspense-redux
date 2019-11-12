import { createAction } from 'redux-pro-kit'

export default (resourceName, handler, selector) => {
  const success = createAction(`${resourceName}_SUCCESS`)
  const error = createAction(`${resourceName}_ERROR`)
  const request = createAction(`${resourceName}_REQUEST`)

  return {
    resourceName,
    selector,
    success,
    error,
    request,
    handler,
    type: request.toString(),
    toString: () => resourceName,
  }
}
