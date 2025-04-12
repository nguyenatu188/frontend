// components/Header.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  return (
    <div className='max-w-7xl mx-auto p-4 flex justify-between items-center'>
      <p className='text-4xl feather-bold font-black text-[#1cb0f6]'>H E L L</p>
      <div className='flex items-center gap-10'>
        <button
          onClick={() => navigate('/login')}
          className="p-3 bg-white rounded-2xl border-2 border-solid border-neutral-200 shadow-[0px_2px_0px_#e5e5e5] text-[#1cb0f6] text-[13px] font-bold leading-[18px] hover:bg-neutral-100 transition"
        >
          ĐĂNG NHẬP
        </button>
        <button 
          onClick={() => navigate('/register')}
          className="p-3 bg-white rounded-2xl border-2 border-solid border-neutral-200 shadow-[0px_2px_0px_#e5e5e5] text-[#1cb0f6] text-[13px] font-bold leading-[18px] hover:bg-neutral-100 transition"
        >
          ĐĂNG KÝ
        </button>
      </div>
    </div>
  )
}

export default Header
