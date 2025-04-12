import React from "react"
import { FaArrowCircleLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export const Register = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1440px] h-[863px] relative">
        <FaArrowCircleLeft
          onClick={() => navigate('/')}
          className="!absolute !w-[30px] !h-[30px] !top-[39px] !left-[23px] text-[#1cb0f6] hover:text-[#1899d6] cursor-pointer transition"
        />
        <button 
          onClick={() => navigate('/login')}
          className="absolute top-[30px] left-[1287px] w-[102px] h-12 bg-white rounded-2xl border-2 border-solid border-neutral-200 shadow-[0px_2px_0px_#e5e5e5] text-[#1cb0f6] text-[13px] font-bold tracking-[0.80px] leading-[18px] hover:bg-neutral-100 transition"
          >
          ĐĂNG NHẬP
        </button>
        <div className="h-[623px] top-[120px] left-[532px] absolute w-[375px]">
          <div className="absolute w-[373px] h-24 top-[515px] left-px">
            <p className="absolute w-[373px] h-9 -top-px left-0 [font-family:'Inter-Medium',Helvetica] font-normal text-[#afafaf] text-sm text-center tracking-[0] leading-5">
              <span className="font-medium">By signing in to HELL, you agree to our </span>
              <span className="[font-family:'Inter-Bold',Helvetica] font-bold">Terms</span>
              <span className="font-medium"> and </span>
              <span className="[font-family:'Inter-Bold',Helvetica] font-bold">Privacy Policy</span>
              <span className="font-medium">.</span>
            </p>
          </div>

          <div className="h-[463px] top-2.5 left-0 absolute w-[375px]">
            <div className="absolute w-[375px] h-5 top-[472px] left-0">
              <div className="relative h-0.5 top-[9px] bg-neutral-200" />
            </div>

            <button className="absolute w-[375px] h-[50px] top-[402px] left-0 bg-[#1cb0f6] rounded-2xl shadow-[0px_4px_0px_#1899d6] font-bold text-white text-[13px] text-center leading-[18px] hover:bg-[#1899d6] transition">
              CREATE ACCOUNT
            </button>

            <div className="absolute w-[375px] h-[327px] top-[55px] left-0">
              <div className="left-2 absolute w-[92px] h-[29px] top-[292px]">
                <div className="absolute w-[63px] h-[29px] top-0 left-[27px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal]">
                  Men
                </div>
                <input
                  type="radio"
                  name="gender"
                  value="men"
                  className="radio radio-info absolute left-0 top-[3px]"
                  defaultChecked
                />
              </div>

              <div className="left-[117px] absolute w-[92px] h-[29px] top-[292px]">
                <div className="absolute w-[63px] h-[29px] top-0 left-[27px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal]">
                  Women
                </div>
                <input
                  type="radio"
                  name="gender"
                  value="women"
                  className="radio radio-info absolute left-0 top-[3px]"
                />
              </div>

              <div className="left-[245px] absolute w-[92px] h-[29px] top-[292px]">
                <div className="absolute w-[63px] h-[29px] top-0 left-[27px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal]">
                  Other
                </div>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  className="radio radio-info absolute left-0 top-[3px]"
                />
              </div>

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-[375px] pl-5 pr-[280px] py-[15px] absolute top-[228px] left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200 [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-[375px] pl-5 pr-[280px] py-[15px] absolute top-[171px] left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200 [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap"
              />

              <input
                type="text"
                placeholder="Username"
                className="w-[375px] pl-5 pr-[280px] py-[15px] absolute top-[114px] left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200 [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-[375px] pl-5 pr-[314px] py-[15px] absolute top-[57px] left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200 mt-[-2.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap"
              />

              <input
                type="text"
                placeholder="Full name"
                className="w-[375px] pl-5 pr-[232px] py-[15px] absolute top-0 left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200 mt-[-2.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap"
              />
            </div>

            <div className="absolute w-[217px] h-[30px] top-1 left-[79px] text-[#3c3c3c] text-[23px] tracking-[0] leading-10 [font-family:'Inter-Bold',Helvetica] font-bold text-center whitespace-nowrap">
              Đăng ký
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register