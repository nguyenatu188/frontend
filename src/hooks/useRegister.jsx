import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"

const useRegister = () => {
  const [isLoading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const register = async (inputs) => {
    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(inputs)
      })

      const data = await res.json()

      if (!res.ok) {
        // Laravel thường trả về errors dưới dạng object
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0]
          throw new Error(firstError)
        }
        throw new Error(data.message || "Đăng ký thất bại")
      }

      // Lưu token + user vào localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setAuthUser(data.user)
      console.log("Đăng ký thành công!")

    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { isLoading, register }
}

export default useRegister
