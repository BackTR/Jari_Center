import api from './axios'

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
| POST /api/register
|
| Body:
| {
|   name: "...",
|   email: "...",
|   password: "...",
|   password_confirmation: "..."
| }
|--------------------------------------------------------------------------
*/

export const registerAccount = async (payload) => {
  const response = await api.post('/register', payload)
  return response
}


/*
|--------------------------------------------------------------------------
| FORGOT PASSWORD
|--------------------------------------------------------------------------
| POST /api/forgot-password
|
| Body:
| {
|   email: "..."
| }
|--------------------------------------------------------------------------
*/

export const requestPasswordReset = async (email) => {
  const response = await api.post('/forgot-password', {
    email,
  })

  return response
}


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