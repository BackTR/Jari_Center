import api from './axios'

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
| POST /api/login
|
| Body:
| {
|   email: "...",
|   password: "..."
| }
|--------------------------------------------------------------------------
*/

export const loginRequest = async (email, password) => {
  const response = await api.post('/login', {
    email,
    password,
  })

  return response
}


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
| POST /api/logout
|--------------------------------------------------------------------------
*/

export const logoutRequest = async () => {
  const response = await api.post('/logout')
  return response
}