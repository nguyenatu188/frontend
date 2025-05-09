import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext({
  authUser: null,
  setAuthUser: () => {},
  isLoading: true,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user)
        setAuthUser(parsedUser)
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        console.error("Error parsing user from localStorage")
      }
    }

    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
