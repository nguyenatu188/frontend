import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <>
      <div className='bg-white flex-col'>
        <Header />
          <div className='max-w-7xl mx-auto p-4 flex justify-center items-center h-screen'>
            <div className='text-center'>
              <h1 className='text-7xl font-bold text-[#1cb0f6]'>Welcome to H E L L</h1>
              <p className='mt-10 text-xl text-gray-600'>Chào mừng đến với HUCE English Learning Lab</p>
              <p className='mt-4 text-xl text-gray-600'>Trang web ôn TOEIC dành cho sinh viên HUCE</p>
            </div>
          </div>
          <Footer />
      </div>
    </>
  )
}

export default LandingPage
