import React from 'react'

const Footer = () => {
  return (
    <div>
      <div className='max-w-7xl mx-auto p-4 flex justify-between items-center'>
        <p className='text-sm text-gray-500'>© 2025 H E L L. All rights reserved.</p>
        <div className='flex items-center gap-4'>
          <a href="#" className='text-gray-500 hover:text-[#1cb0f6]'>Privacy Policy</a>
          <a href="#" className='text-gray-500 hover:text-[#1cb0f6]'>Terms of Service</a>
        </div>
      </div>
      <div className='border-t border-gray-200 mt-4'></div>
      <div className='max-w-7xl mx-auto p-4 flex justify-center items-center'>
        <p className='text-sm text-gray-500'>Made with ❤️ by H E L L Team</p>
      </div>
    </div>
  )
}

export default Footer
