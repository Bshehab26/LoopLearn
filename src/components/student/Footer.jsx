
import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-center px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/20 '>
        <div className='flex flex-col md:items-start items-center w-full'>
           <Link to="/" className="flex items-center">
          <h1 className="font-extrabold text-2xl md:text-3xl text-white/50 tracking-wide">
            LOOP<span className="text-purple-600">LEARN</span>
          </h1>
        </Link>
        <p className='mt-6 text-center md:text-left text-sm text-white/80'>Get in touch with us!</p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
           <h2 className='font-semibold text-white mb-5'>Company</h2>
           <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privacy Policy</a></li>
           </ul>
        </div>
        <div className='hidden md:flex flex-col items-start w-full'>
              <h2 className='font-semibold text-white mb-5'>Subscribe to our Newsletter</h2>
              <p className='text-sm text-white/80'>Stay updated with our latest news and offers.</p>
              <div className='flex items-center gap-2 pt-4'>
                  <input type="email" placeholder='Enter your email' className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounden px-2 text-sm' />
                  <button className='bg-purple-600 text-white px-4 py-2 rounded-r-md rounded-l-md'>Subscribe</button>
              </div>
        </div>
      </div>
      <p className='text-center text-sm text-white/80 py-6'> Copyright &copy; LoopLearning Platform. All rights reserved.</p>
    </footer>
  )
}

export default Footer
