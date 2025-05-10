import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"

const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const logout = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Bạn chưa đăng nhập")
      }

      const res = await fetch("http://127.0.0.1:8000/api/v1/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Đăng xuất thất bại")
      }

      // Xoá localStorage + context
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setAuthUser(null)

      console.log("Đăng xuất thành công!")
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, logout }
}

export default useLogout
