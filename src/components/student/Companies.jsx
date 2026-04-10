import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-16'>
      <p className='text-base text-gray-600'>
        Trusted by learners worldwide.
      </p>
      <div className='flex items-center justify-center gap-10 mt-6 flex-wrap md:gap-16 md:mt-10'>
        <img src={assets.microsoft_logo} alt="Microsoft" className='w-20 md:w-28' />
        <img src={assets.walmart_logo} alt="Walmart" className='w-20 md:w-28' />
        <img src={assets.accenture_logo} alt="Accenture" className='w-20 md:w-28' />
        <img src={assets.adobe_logo} alt="Adobe" className='w-20 md:w-28' />
        <img src={assets.paypal_logo} alt="PayPal" className='w-20 md:w-28' />
      </div>
    </div>
  )
}

export default Companies
