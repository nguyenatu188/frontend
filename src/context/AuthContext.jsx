import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext({
  authUser: null,
  setAuthUser: () => {},
  isLoading: true,
  isRefreshing: false,
  fetchWithAuth: async () => {},
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getToken = () => localStorage.getItem("token")

  const fetchWithAuth = async (url, options = {}) => {
    let token = getToken()
    const headers = options.headers || {}
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    
    const updatedOptions = {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      let response = await fetch(url, updatedOptions)

      // Xử lý token hết hạn
      if (response.status === 401 && !isRefreshing) {
        setIsRefreshing(true)
        
        try {
          const refreshRes = await fetch("http://127.0.0.1:8000/api/v1/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })

          if (!refreshRes.ok) throw new Error("Refresh failed")

          const data = await refreshRes.json()
          localStorage.setItem("token", data.token)
          updatedOptions.headers.Authorization = `Bearer ${data.token}`
          
          // Retry original request
          response = await fetch(url, updatedOptions)
          if (data.user) setAuthUser(data.user)
          
        } finally {
          setIsRefreshing(false)
        }
      }

      return response
    } catch (err) {
      if (err.message.includes("Phiên đăng nhập đã hết hạn")) {
        localStorage.removeItem("token")
        setAuthUser(null)
        window.location.href = "/login"
      }
      throw err
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/v1/user")
        if (res.ok) {
          const data = await res.json()
          setAuthUser(data.user)
        }
      } catch (err) {
        console.error("Auth initialization error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, isLoading, fetchWithAuth, isRefreshing }}>
      {children}
    </AuthContext.Provider>
  )
}
