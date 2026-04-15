import React ,{useContext}from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
const CourseCard = ({course}) => {
  const { currency, calculateRating } = useContext(AppContext);
  return (
   <Link to={'/course/'+course._id} onClick={()=> scrollTo(0,0,)} className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
        <img className='w-full' src={course.courseThumbnail} alt={course.title} />
        <div className='p-3 text-left'>
          <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
          <p className='text-gray-500'>LoopLearn</p>
          <div className='flex  items-center space-x-2'>
            <p>{calculateRating(course).toFixed(1)}</p>
            <div className='flex'>
                 {[...Array(5)].map((_, i) => (<img className='w-5 h-5' key={i} src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt=''/>))}
            </div>
            <p className='text-gray-500'>{course.courseRatings?.length || 0} reviews</p>
          </div>
          <p className='text-base font-semibold text-gray-800'>${currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
        </div>
   </Link>
  )
}

export default CourseCard
