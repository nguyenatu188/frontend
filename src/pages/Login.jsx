import { useState } from "react"
import { FaArrowCircleLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import useLogin from "../hooks/useLogin"

export const Login = () => {
  const navigate = useNavigate()

  const [ inputs, setInputs ] = useState({
		email: "",
		password: "",
	})

  const { loading, login } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(inputs.email, inputs.password)
  }
  return (
    <>
      <div className="bg-white h-screen flex flex-col items-center">
        <div className="max-w-7xl flex justify-between w-full mt-5">
          <FaArrowCircleLeft onClick={() => navigate('/')} className="!w-[30px] !h-[30px] text-[#1cb0f6] hover:text-[#1899d6] cursor-pointer transition"/>
          <button
            onClick={() => navigate('/register')}
            className="p-4 bg-white rounded-2xl border-2 border-solid border-neutral-200 shadow-[0px_2px_0px_#e5e5e5] text-[#1cb0f6] text-[13px] font-bold tracking-[0.80px] leading-[18px] hover:bg-neutral-100 transition"
            >
            ĐĂNG KÝ
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col items-center justify-center gap-5">
          <div className="w-[168px] h-[30px] text-[#3c3c3c] text-[23px] leading-10 font-bold text-center">
            Đăng nhập
          </div>
            <div className=" w-[375px] h-[49px] bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200">
              <input
                type="email"
                placeholder="Email"
                value={inputs.email}
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                className="w-full h-full px-5 py-3 text-[#3c3c3c] text-base font-medium rounded-2xl bg-transparent focus:outline-none"
              />
            </div>
            <div className="w-[375px] h-[49px] bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200 relative">
              <input
                type="password"
                placeholder="Password"
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                className="w-full h-full px-5 py-3 text-[#3c3c3c] text-base font-medium rounded-2xl bg-transparent focus:outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#afafaf] text-[13px] font-bold cursor-pointer">
                FORGOT?
              </div>
            </div>
          <button className=" w-[375px] h-[47px] bg-[#1cb0f6] rounded-2xl shadow-[0px_4px_0px_#1899d6] font-bold text-white text-[13px] text-center leading-[18px] hover:bg-[#1899d6] transition disabled={loading}">
            {loading ? "Loading..." : "Login"}
          </button>
          <div className="divider divider-info"></div>
          <p className="w-[373px] font-medium text-[#afafaf] text-sm text-center leading-5">
            By signing in to HELL, you agree to our{" "}
            <a
              href="#"
              className="font-bold text-[#afafaf] underline hover:text-[#1cb0f6]"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-bold text-[#afafaf] underline hover:text-[#1cb0f6]"
            >
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </>
  )
}

export default Login
