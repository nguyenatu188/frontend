import React from "react"
import { FaArrowCircleLeft } from "react-icons/fa"

export const Login = () => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1440px] h-[863px] relative">
        <div className="h-[451px] top-48 left-[532px] absolute w-[375px]">
          <div className="absolute w-[373px] h-[65px] top-[289px] left-px">
            <p className="absolute w-[373px] h-9 top-3.5 left-px font-medium text-[#afafaf] text-sm text-center leading-5">
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
          </div>

          <div className="h-[270px] top-2.5 left-0 absolute w-[375px]">
            <div className="absolute w-[375px] h-5 top-[259px] left-0">
              <div className="relative h-0.5 top-[9px] bg-neutral-200" />
            </div>

            <button className="absolute w-[375px] h-[47px] top-[186px] left-0 bg-[#1cb0f6] rounded-2xl shadow-[0px_4px_0px_#1899d6] font-bold text-white text-[13px] tracking-[0.80px] text-center leading-[18px] hover:bg-[#1899d6] transition">
              LOG IN
            </button>

            <div className="absolute w-[375px] h-[114px] top-[55px] left-0">
              <div className="absolute w-[375px] h-[49px] top-2 left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200">
                <input
                  type="text"
                  placeholder="username"
                  className="w-full h-full px-5 py-3 text-[#3c3c3c] text-base font-medium rounded-2xl bg-transparent focus:outline-none"
                />
              </div>

              <div className="w-[375px] h-[49px] top-[65px] bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200 absolute left-0">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-full px-5 py-3 text-[#3c3c3c] text-base font-medium rounded-2xl bg-transparent focus:outline-none"
                />
                <div className="absolute top-3.5 right-5 text-[#afafaf] text-[13px] font-bold cursor-pointer">
                  FORGOT?
                </div>
              </div>
            </div>

            <div className="absolute w-[168px] h-[30px] top-[7px] left-[103px] text-[#3c3c3c] text-[23px] leading-10 font-bold text-center">
              Đăng nhập
            </div>
          </div>
        </div>

        <button className="absolute top-[30px] left-[1287px] w-[102px] h-12 bg-white rounded-2xl border-2 border-solid border-neutral-200 shadow-[0px_2px_0px_#e5e5e5] text-[#1cb0f6] text-[13px] font-bold tracking-[0.80px] leading-[18px] hover:bg-neutral-100 transition">
          ĐĂNG KÝ
        </button>

        <FaArrowCircleLeft className="!absolute !w-[30px] !h-[30px] !top-[39px] !left-[23px] text-[#1cb0f6] hover:text-[#1899d6] cursor-pointer transition"/>
      </div>
    </div>
  )
}

export default Login
