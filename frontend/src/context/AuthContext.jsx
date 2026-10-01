import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import {
  loginRequest,
  logoutRequest,
} from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('jari_user')

      if (!raw) {
        return null
      }

      return JSON.parse(raw)
    } catch (error) {
      localStorage.removeItem('jari_user')
      return null
    }
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('jari_token')
  })

  const [ready, setReady] = useState(true)

  /*
  |--------------------------------------------------------------------------
  | HANDLE UNAUTHORIZED
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('jari_token')
      localStorage.removeItem('jari_user')

      setUser(null)
      setToken(null)
    }

    window.addEventListener(
      'jari:unauthorized',
      handleUnauthorized
    )

    return () => {
      window.removeEventListener(
        'jari:unauthorized',
        handleUnauthorized
      )
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const login = useCallback(async (email, password) => {
    const { data } = await loginRequest(
      email,
      password
    )

    if (!data?.token) {
      throw new Error(
        'Token login tidak ditemukan dari server.'
      )
    }

    if (!data?.user) {
      throw new Error(
        'Data user tidak ditemukan dari server.'
      )
    }

    /*
     * Simpan token
     */
    localStorage.setItem(
      'jari_token',
      data.token
    )

    /*
     * Simpan seluruh data user,
     * termasuk facility_name jika dikirim backend.
     */
    localStorage.setItem(
      'jari_user',
      JSON.stringify(data.user)
    )

    setToken(data.token)
    setUser(data.user)

    return data.user
  }, [])

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch (error) {
      /*
       * Walaupun API logout gagal,
       * session lokal tetap harus dibersihkan.
       */
    } finally {
      localStorage.removeItem('jari_token')
      localStorage.removeItem('jari_user')

      setToken(null)
      setUser(null)
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | CONTEXT
  |--------------------------------------------------------------------------
  */

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        ready,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/*
|--------------------------------------------------------------------------
| USE AUTH
|--------------------------------------------------------------------------
*/

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error(
      'useAuth harus dipakai di dalam <AuthProvider>'
    )
  }

  return ctx
}