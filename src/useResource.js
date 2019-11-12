import { useSelector } from 'react-redux'

import { LOADING, SUCCESS, ERROR } from './constants'


export default resource => {

  const { selector } = resource

  const { data: suspenseData, status, errorMessage, promise } = useSelector(state => state.suspense[resource])

  let data
  if (selector) data = useSelector(selector)
  else data = suspenseData

  if (status === SUCCESS) return data
  if (status === ERROR) throw errorMessage
  if (status === LOADING) throw promise
}
