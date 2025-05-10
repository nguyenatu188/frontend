import React, { useState } from "react"
import { FaArrowCircleLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import useRegister from "../hooks/useRegister"

export const Register = () => {
  const navigate = useNavigate()

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    full_name: "",
    gender: "",
  })

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const { isLoading, register } = useRegister()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await register(inputs)
  }

  return (
    <div className="bg-white h-screen flex flex-col items-center">
      <div className="max-w-7xl flex justify-between w-full mt-5 px-4">
        <FaArrowCircleLeft
          onClick={() => navigate('/')}
          className="w-[30px] h-[30px] text-[#1cb0f6] hover:text-[#1899d6] cursor-pointer transition"
        />
        <button
          onClick={() => navigate('/login')}
          className=" p-4 bg-white rounded-2xl border-2 border-solid border-neutral-200 shadow-[0px_2px_0px_#e5e5e5] text-[#1cb0f6] text-[13px] font-bold tracking-[0.80px] leading-[18px] hover:bg-neutral-100 transition"
        >
          ĐĂNG NHẬP
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center flex-1 gap-5">
        <h2 className="text-[#3c3c3c] text-[23px] leading-10 font-bold">Đăng ký</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={inputs.email}
          onChange={handleChange}
          className="w-[375px] px-5 py-3 bg-[#f7f7f7] rounded-2xl border-2 border-neutral-200 text-base text-[#3c3c3c] font-medium focus:outline-none"
        />

        <input
          type="text"
          name="full_name"
          placeholder="Full name"
          value={inputs.full_name}
          onChange={handleChange}
          className="w-[375px] px-5 py-3 bg-[#f7f7f7] rounded-2xl border-2 border-neutral-200 text-base text-[#3c3c3c] font-medium focus:outline-none"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={inputs.username}
          onChange={handleChange}
          className="w-[375px] px-5 py-3 bg-[#f7f7f7] rounded-2xl border-2 border-neutral-200 text-base text-[#3c3c3c] font-medium focus:outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={inputs.password}
          onChange={handleChange}
          className="w-[375px] px-5 py-3 bg-[#f7f7f7] rounded-2xl border-2 border-neutral-200 text-base text-[#3c3c3c] font-medium focus:outline-none"
        />

        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={inputs.confirm_password}
          onChange={handleChange}
          className="w-[375px] px-5 py-3 bg-[#f7f7f7] rounded-2xl border-2 border-neutral-200 text-base text-[#3c3c3c] font-medium focus:outline-none"
        />

        <div className="w-[375px] flex justify-between">
          {["male", "female", "other"].map((gender) => (
            <label key={gender} className="flex items-center gap-2 text-base font-medium text-[#3c3c3c]">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={inputs.gender === gender}
                onChange={handleChange}
                className="radio radio-info"
              />
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-[375px] h-[47px] bg-[#1cb0f6] rounded-2xl shadow-[0px_4px_0px_#1899d6] font-bold text-white text-[13px] text-center leading-[18px] hover:bg-[#1899d6] transition"
        >
          {isLoading ? "LOADING..." : "CREATE ACCOUNT"}
        </button>

        <div className="divider divider-info"></div>

        <p className="w-[373px] font-medium text-[#afafaf] text-sm text-center leading-5">
          By signing in to HELL, you agree to our{" "}
          <a href="#" className="font-bold text-[#afafaf] underline hover:text-[#1cb0f6]">Terms</a>{" "}
          and{" "}
          <a href="#" className="font-bold text-[#afafaf] underline hover:text-[#1cb0f6]">Privacy Policy</a>.
        </p>
      </form>
    </div>
  )
}

export default Register
