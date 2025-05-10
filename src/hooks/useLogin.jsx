import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Lưu token vào localStorage
      localStorage.setItem("token", data.token)

      // Lưu user vào context (tuỳ bạn lưu thêm nếu cần)
      localStorage.setItem("user", JSON.stringify(data.user))
      setAuthUser(data.user)
    } catch (error) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, login }
}

export default useLogin
