import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Lấy token và email từ URL params
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || "Đặt lại mật khẩu thất bại")
      }

      setMessage("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.")
      setTimeout(() => navigate("/login"), 3000)
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.")
      console.error("Lỗi khi đặt lại mật khẩu:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-[400px] text-center">
          <h2 className="text-red-600 mb-4">Liên kết không hợp lệ</h2>
          <p className="text-gray-600">
            Vui lòng yêu cầu gửi lại liên kết đặt lại mật khẩu.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white p-8 rounded-xl shadow-md w-[400px]"
      >
        <h2 className="text-xl text-center text-gray-700">Đặt lại mật khẩu</h2>
        
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-400 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-[#1cb0f6] transition"
          required
          minLength="8"
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="border border-gray-400 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-[#1cb0f6] transition"
          required
          minLength="8"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          className="bg-[#1cb0f6] text-white rounded-md py-2 font-semibold hover:bg-[#1899d6] transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
        </button>

        {message && <p className="text-center text-sm text-green-600">{message}</p>}
        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <p className="text-sm text-center mt-3">
          <span className="text-[#1cb0f6] cursor-pointer hover:underline" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </span>
        </p>
      </form>
    </div>
  )
}

export default ResetPassword
