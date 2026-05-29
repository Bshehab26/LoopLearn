import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export const TOKEN_KEY = 'looplearn_token'

// .NET ClaimTypes map to these URIs in the JWT
const CLAIM_NAME       = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
const CLAIM_EMAIL      = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
const CLAIM_ROLE       = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const CLAIM_NAMEIDENT  = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'

/** Save JWT to a secure cookie */
export function saveToken(token, expiresOn) {
  const expires = expiresOn ? new Date(expiresOn) : undefined;
  Cookies.set(TOKEN_KEY, token, {
    expires,
    path: '/',               
    sameSite: 'Strict',
    // secure: true,        // enable in production with HTTPS
  });
}
export function removeToken() {
  Cookies.remove(TOKEN_KEY)
}

/** Read raw JWT string from cookie */
export function getToken() {
  return Cookies.get(TOKEN_KEY) || null
}

/** Decode token and return user payload, or null if missing/invalid/expired */
export function getUser() {
  const token = getToken()
  if (!token) return null
  try {
    const decoded = jwtDecode(token)
    // Check expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      removeToken()
      return null
    }
    return {
      id:       decoded[CLAIM_NAMEIDENT] || decoded.sub || null,
      username: decoded[CLAIM_NAME]      || decoded.name || null,
      email:    decoded[CLAIM_EMAIL]     || decoded.email || null,
      role:     decoded[CLAIM_ROLE]      || decoded.role  || null,
    }
  } catch {
    return null
  }
}
