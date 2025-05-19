import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Typewriter from 'typewriter-effect'

const LandingPage = () => {
  return (
    <div className='bg-white flex-col'>
      <Header />
      <div className='max-w-7xl mx-auto p-4 flex justify-center items-center h-screen'>
        <div className='text-center'>
          <Typewriter
            options={{
              loop: true,
              delay: 50,
              deleteSpeed: 30,
            }}
            onInit={(typewriter) => {
              typewriter
                // Sequence 1: Welcome to H E L L
                .typeString('<h1 class="text-7xl font-bold text-[#1cb0f6]">Welcome to H E L L</h1>')
                .pauseFor(1000)
                
                // Sequence 2: Dòng đầu tiên
                .typeString('<div class="mt-10 text-xl text-gray-600">Chào mừng đến với HUCE English Learning Lab</div>')
                .pauseFor(1000)
                
                // Sequence 3: Dòng thứ hai
                .typeString('<div class="mt-4 text-xl text-gray-600">Trang web ôn TOEIC dành cho sinh viên HUCE</div>')
                .pauseFor(2000)
                
                // Xóa toàn bộ để chuẩn bị loop lại
                .deleteAll(0)
                .start()
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default LandingPage
