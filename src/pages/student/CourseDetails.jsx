import React,{useState, useContext, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/Appcontext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';
const CourseDetails = () => {
  const{id}=useParams()
  const[CourseDetails,setCourseDetails]=useState(null)
  const[openSections,setOpenSections]=useState({})
  const[isAlreadyEnrolled,setIsAlreadyEnrolled]=useState(false)
  const[watchCourse,setWatchCourse]=useState(null)
  const{allCourses, calculateRating,calculateNOfLectures,calculateChapterTime,calculateCourseDuration,currency}=useContext(AppContext)
  const fetchCourseDetails=async()=>{
    try {
      const findCourse = allCourses.find(course => course._id === id);
      setCourseDetails(findCourse);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id, allCourses]);
const toggleSection=(index)=>{
   setOpenSections((prev)=>(
    {...prev,[index]:!prev[index]}
   ))
}

  return CourseDetails ? (
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left '>
      <div className='absolute top-0 left-0 w-full h-[60vh] -z-1 bg-linear-to-b from-purple-500/30'>

      </div>
      {/* left column */}
      <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='md:text-4xl text-2xl font-semibold text-gray-800 '>{CourseDetails.courseTitle}</h1>
          <p dangerouslySetInnerHTML={{ __html: CourseDetails.courseDescription.slice(0, 200) + '...' }} className='pt-4 md:text-base text-sm'></p>
          {/* review and ratings */}
           <div className='flex  items-center space-x-2 pt-4 pb-2 text-sm'>
                      <p>{calculateRating(CourseDetails).toFixed(1)}</p>
                      <div className='flex'>
                           {[...Array(5)].map((_, i) => (<img className='w-5 h-5' key={i} src={i < Math.floor(calculateRating(CourseDetails)) ? assets.star : assets.star_blank} alt=''/>))}
                      </div>
                      <p className='text-purple-600'>{CourseDetails.courseRatings?.length } {CourseDetails.courseRatings?.length > 1 ? 'reviews' : 'review'}</p>
                      <p className='text-gray-500'>{CourseDetails.enrolledStudents.length} {CourseDetails.enrolledStudents.length >1 ? 'students' : 'student'}</p>
            </div>
            <p className='text-sm'>Course By <span className='text-purple-600 underline'>LoopLearn</span></p>
            <div className='pt-8 text-gray-800'>
              <h2 className='text-xl font-semibold'>Course Structure</h2>
              <div className='pt-5'>
                {CourseDetails.courseContent.map((chapter,index)=>(
                  <div className='border border-gray-300 bg-white mb-2 rounded' key={index}>
                    <div className='flex items-center justify-between px-4 py-3 cursor-pointer setect-none' onClick={()=>toggleSection(index)}>
                       <div className='flex items-center gap-2'>
                        <img className={`transform transition-transform ${openSections [index] ?'rotate-180':''}`} src={assets.down_arrow_icon} alt="arrow ixon" />
                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                       </div>
                       <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures -{calculateChapterTime(chapter)}</p>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${openSections[index]?'max-h-96':'max-h-0'}`}>
                      <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                        {chapter.chapterContent.map((lecture,i)=>(
                          <li key={i} className='flex items-start gap-2 py-1'>
                            <img src={assets.play_icon} alt="paly icon" className='w-4 h-4 mt-1' />
                            <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                              <p>
                                {lecture.lectureTitle}
                              </p>
                              <div className='flex gap-2'>
                                {lecture.isPreviewFree && <p onClick={()=>setWatchCourse({videoId:lecture.lectureUrl.split('/').pop()})} className='text-purple-800 cursor-pointer'>Previw</p>}
                                <p>
                                  {humanizeDuration(lecture.lectureDuration *60*1000,{units:["h","m"]})}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

            </div>
            <div className='py-20 text-sm md:text-default'>
              <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
              <p dangerouslySetInnerHTML={{ __html: CourseDetails.courseDescription}} className='pt-3 rich-text '></p>
            </div>
      </div>
      {/* right column */}
      <div className='max-w-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-105'>
          {
              watchCourse ?
                <YouTube videoId={watchCourse.videoId}  opts={{playerVars:{autoplay:1}}} iframeClassName='w-full aspect-video' onEnd={()=>setWatchCourse(null)}/>
              :  <img src={CourseDetails.courseThumbnail} alt='course thumbnail'/>
            }
        <div className='p-5 '>
          <div className='flex items-center gap-2'>
            <img src={assets.time_left_clock_icon} alt="left-clock" className='w-3.5' />
            <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price</p>
          </div>
          <div className='flex items-center gap-2 pt-3'>
            <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency}{(CourseDetails.coursePrice -CourseDetails.discount*CourseDetails.coursePrice/100).toFixed(2) }</p>
            <p className='md:text-lg text-gray-500 line-through'>{currency}{CourseDetails.coursePrice}</p>
            <p className='md:text-lg text-purple-800 font-medium'>{CourseDetails.discount}% off</p>
          </div>
          <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
            <div className='flex items-center gap-1'>
              <img src={assets.star} alt="star icon" />
              <p>{calculateRating(CourseDetails)}</p>
            </div>
            <div className='h-4 w-px bg-gray-500/40'></div>
            <div className='flex items-center gap-1'>
              <img src={assets.time_clock_icon} alt="clock icon" />
              <p>{calculateCourseDuration(CourseDetails)}</p>
            </div>
            <div className='h-4 w-px bg-gray-500/40'></div>
            <div className='flex items-center gap-1'>
              <img src={assets.lesson_icon} alt="lesson icon" />
              <p>{calculateNOfLectures(CourseDetails)} {calculateNOfLectures(CourseDetails)>1?"lessons":"lesson"}</p>
            </div>
          </div>
          <button className='md:mt-6 mt-4 w-full py-3 bg-linear-to-r from-purple-600 to-purple-800 text-white  rounded-full  font-medium shadow-md hover:scale-105 transition duration-300'>{isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}</button>
          <div className='pt-6'>
            <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course</p>
            <ul className='ml-4 pt-2  text-sm md:text-default list-disc text-gray-500'>
              <li>lifetime access with free updates </li>
              <li>step-by-step, hands-on projects </li>
              <li>Dowenloadable resources and source code </li>
              <li>Quizzes to test your knowledge </li>
              <li>Certificate of completion </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
    <Footer/>
    </>
  ) : (
    <Loading/>
  )
}

export default CourseDetails
