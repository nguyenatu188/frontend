import React from "react"

export const Register = () => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1440px] h-[863px] relative">
        <div className="flex w-28 items-start pl-[17.96px] pr-[19.04px] pt-[15px] pb-[17px] absolute top-[21px] left-[1296px] rounded-2xl">
          <div className="absolute w-28 h-12 top-0 left-0 bg-white rounded-2xl border-2 border-solid border-neutral-200 shadow-[0px_2px_0px_#e5e5e5]" />

          <div className="relative w-fit mt-[-1.00px] mr-[-11.00px] text-[#1cb0f6] text-[13px] tracking-[0.80px] leading-[18px] [font-family:'Inter-Bold',Helvetica] font-bold text-center whitespace-nowrap">
            ĐĂNG NHẬP
          </div>
        </div>

        <div className="h-[623px] top-[120px] left-[532px] absolute w-[375px]">
          <div className="absolute w-[373px] h-24 top-[515px] left-px">
            <p className="absolute w-[373px] h-9 -top-px left-0 [font-family:'Inter-Medium',Helvetica] font-normal text-[#afafaf] text-sm text-center tracking-[0] leading-5">
              <span className="font-medium">
                By signing in to HELL, you agree to our{" "}
              </span>

              <span className="[font-family:'Inter-Bold',Helvetica] font-bold">
                Terms
              </span>

              <span className="font-medium"> and </span>

              <span className="[font-family:'Inter-Bold',Helvetica] font-bold">
                Privacy Policy
              </span>

              <span className="font-medium">.</span>
            </p>
          </div>

          <div className="h-[463px] top-2.5 left-0 absolute w-[375px]">
            <div className="absolute w-[375px] h-5 top-[472px] left-0">
              <div className="relative h-0.5 top-[9px] bg-neutral-200" />
            </div>

            <button className="all-[unset] box-border absolute w-[375px] h-[50px] top-[402px] left-0 rounded-2xl">
              <div className="relative h-[46px] -top-1 bg-[#1cb0f6] rounded-2xl shadow-[0px_4px_0px_#1899d6]">
                <div className="absolute w-[132px] h-[18px] top-[13px] left-[122px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-[13px] text-center tracking-[0.80px] leading-[18px] whitespace-nowrap">
                  CREATE ACCOUNT
                </div>
              </div>
            </button>

            <div className="absolute w-[375px] h-[327px] top-[55px] left-0">
              <div className="left-[245px] absolute w-[92px] h-[29px] top-[292px]">
                <div className="absolute w-[63px] h-[29px] top-0 left-[27px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal]">
                  Other
                </div>

                <RadioButton
                  className="!absolute !left-0 !top-[3px]"
                  stateProp="default"
                />
              </div>

              <div className="left-[117px] absolute w-[92px] h-[29px] top-[292px]">
                <div className="absolute w-[63px] h-[29px] top-0 left-[27px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal]">
                  Women
                </div>

                <RadioButton
                  className="!absolute !left-0 !top-[3px]"
                  stateProp="default"
                />
              </div>

              <div className="left-2 absolute w-[92px] h-[29px] top-[292px]">
                <div className="absolute w-[63px] h-[29px] top-0 left-[27px] [font-family:'Inter-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal]">
                  Men
                </div>

                <RadioButton
                  className="!absolute !left-0 !top-[3px]"
                  stateProp="default"
                />
              </div>

              <div className="flex w-[375px] items-start pl-5 pr-[280px] py-[15px] absolute top-[228px] left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200">
                <div className="relative w-fit mt-[-2.00px] mr-[-66.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  Confirm Password
                </div>
              </div>

              <div className="flex w-[375px] items-start pl-5 pr-[280px] py-[15px] absolute top-[171px] left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200">
                <div className="relative w-fit mt-[-2.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  Password
                </div>
              </div>

              <div className="flex w-[375px] items-start pl-5 pr-[280px] py-[15px] absolute top-[114px] left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200">
                <div className="relative w-fit mt-[-2.00px] mr-[-4.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  Username
                </div>
              </div>

              <input
                className="w-[375px] pl-5 pr-[314px] py-[15px] absolute top-[57px] left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200 mt-[-2.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap"
                placeholder="Email"
                type="email"
              />

              <input
                className="w-[375px] pl-5 pr-[232px] py-[15px] absolute top-0 left-0 bg-[#f7f7f7] rounded-2xl border-2 border-solid border-neutral-200 mt-[-2.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#afafaf] text-base tracking-[0] leading-[normal] whitespace-nowrap"
                placeholder="Full name"
                type="text"
              />
            </div>

            <div className="absolute w-[217px] h-[30px] top-1 left-[79px] text-[#3c3c3c] text-[23px] tracking-[0] leading-10 [font-family:'Inter-Bold',Helvetica] font-bold text-center whitespace-nowrap">
              Đăng ký
            </div>
          </div>

          <ArrowBack className="!absolute !w-[30px] !h-[30px] !top-[-90px] !left-[-506px]" />
        </div>
      </div>
    </div>
  )
}

export default Register