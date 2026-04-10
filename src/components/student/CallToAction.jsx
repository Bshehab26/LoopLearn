import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className=' bg-gray-50 w-full flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0  '>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Learn anything,anytime,anywhere</h1>
      <p className='text-gray-500 sm:text-sm'>Start your learning journey today!</p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <button className='bg-purple-700 text-white px-6 py-3 rounded-md hover:bg-purple-900'>Get Started</button>
        <button className='flex items-center gap-2 text-purple-700 hover:text-purple-900'>Learn More <img src={assets.arrow_icon} alt="arrow_icon" /></button>
      </div>
    </div>
  )
}

export default CallToAction
