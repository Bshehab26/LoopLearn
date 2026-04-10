import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>Here From Our Learners As They Share Their Journeys Of Transfomation,Success,And How Our<br/>Platform Has Made A Difference In Their Lives</p>
     <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
       {dummyTestimonial.map((testimonial,index)=>(
        <div className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] shadow-black/5 overflow-hidden' key={index}>
          <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
            <img className='h-12 w-12 rounded-full' src={testimonial.image} alt={testimonial.name} />
            <div>
              <h1 className='text-lg font-medium text-gray-800'>{testimonial.name}</h1>
              <p className='text-gray-800/80'>{testimonial.role}</p>
            </div>
           </div>
             <div className='p-5 pb-7'>
             <div className='flex gap-0.5'>
              {[...Array(5)].map((_,i)=>(
                <img className='h-5' key={i} src={i< Math.floor(testimonial.rating)? assets.star : assets.star_blank} alt="star" />
              ))}
            </div>
            <p className='text-gray-500 mt-5'>{testimonial.feedback}</p>
          </div>
          <a href="#" className='text-purple-600 hover:text-purple-900 px-5'>Read More</a>
        </div>
      ))}
     </div>
    </div>
  )
}

export default TestimonialSection
