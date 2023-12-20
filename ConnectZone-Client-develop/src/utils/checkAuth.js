import HandleAuthToken from './HandleAuthToken'

const checkAuth = () => {
  const accessToken = JSON.parse(localStorage.getItem('accessToken'))
  if (!accessToken) {
    return false
  }
  HandleAuthToken(accessToken)
  return true
}
export default checkAuth
