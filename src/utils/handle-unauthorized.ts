
export function handleUnauthorized(response: Response): boolean {
  if (response.status !== 401) return false

  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.setItem('isLoggedIn', 'false')
  window.location.href = '/sign-in'
  return true
}
