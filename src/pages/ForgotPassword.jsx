import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!emailRegex.test(email)) {
        setError("Email không hợp lệ");
        return;
      }
      
      if (!res.ok) {
        throw new Error(data.message || "Không thể gửi email. Vui lòng thử lại.")
      }

      setMessage("Đã gửi liên kết đặt lại mật khẩu vào email của bạn!")
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.")
      console.error("Lỗi khi gửi email:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white p-8 rounded-xl shadow-md w-[400px]"
      >
        <h2 className="text-xl text-center text-gray-700">Quên mật khẩu</h2>
        
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-[#1cb0f6] transition"
          required
          disabled={isLoading}
        />
        
        <button
          type="submit"
          className="bg-[#1cb0f6] text-white rounded-md py-2 font-semibold hover:bg-[#1899d6] transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Gửi liên kết đặt lại mật khẩu'}
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

export default ForgotPassword