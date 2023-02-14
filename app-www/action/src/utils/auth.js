import Cookies from 'js-cookie'

const TokenKey = 'apptk'
const name = 'applc'

export function getToken() {

  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getCookie() {
  return Cookies.get(name)
}
export function setCookie(token) {
  return Cookies.set(name, token)
}
export function removeCookie() {
  return Cookies.remove(name)
}
