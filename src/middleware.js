const isRequest = action => /_REQUEST$/.test(action)

export default ({ dispatch }) => next => async action => {
  const { type, handler, success, error } = action
  if (!isRequest(type)) return next(action)

  const promise = async () => {
    try {
      const response = await handler()
      dispatch(success(response))
    } catch (err) {
      dispatch(error(err));
    }
  }
  action.promise = promise()
  return next(action)
}
