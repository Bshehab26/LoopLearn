import React, { useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import"@fontsource/poppins";
import"@fontsource/poppins/700.css";
import heroBg from "../assets/backgrounds/hero.jpg";
import { RiSearch2Line } from "react-icons/ri";
import skillImg1 from "../assets/icons/skill.png";
import skillImg2 from "../assets/icons/certicate.png";
import skillImg3 from "../assets/icons/promotion.png";
import skillImg4 from "../assets/icons/education.png";
import { img, title } from "framer-motion/client";
const requirements = [
  {
    img: skillImg1,
    title: "Earn The Essential skills",
  },
  {
    img: skillImg2,
    title: "Earn certificates and degrees",
  },
  {
    img: skillImg3,
    title: "Get ready for the next career",
  },
  {
    img: skillImg4,
    title: "Master different areas",
  },
];


const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-col items-center justify-center relative min-h-[600px] sm:h-[100vh]">
          <img className="absolute w-full h-full z-10 object-cover" src={heroBg} alt="backgrond image" />
          <div className="absolute z-20 w-full h-full bg-[#00000093]">
          </div>
          <div className="flex lg:flex-row flex-col items-center justify-center lg:justify-start gap-10 relative w-full h-full max-w-[1400px] p-3 sm:p-5 md:p-10">
                 <div className="flex flex-col items-start text-start space-y-4 z-20 ">
                     <p className="lg:text-3xl text-xl font-semibold text-white" style={{fontFamily:"poppins, sans-serif"}}>
                       Join Us today to get
                     </p>
                     <h1 className="tect-4xl md:text-5xl lg:text-6xl text-white font-bold max-w-full lg:max-w-[800px] text-balance leading-[50px] md:leading-[80px]">
                          <span className="text-[#b958f5]">
                           120+
                          </span>
                          Coures Taught By{""}
                          <span className="text-[#b958f5] m-2">
                          10 
                          </span>
                           Top Insturctors  And Institutions{""}
                     </h1>
                     <p className="md:text-2xl text-xl text-gray-50">Elevate Your Eductional Institution To New Height.</p>
                     <form action="" className=" flex lg:w=fit w=full relative mt-5">
                        <input type="text" className="bg-white border-gray-300 text-gray-700 outline-none w-full lg:min-w-[600px] pr-19 pl-4 py-5 rounded-[8px] placeholder:text-sm lg:placeholder:text-lg" placeholder="search courses..." />
                        <button className="absolute right-0 h-full bg-purple-600 px-5 rounded-tr-[8px] rounded-br-[8px] text-[1em] transition-ease-in-out duration-0.3 cursor-pointer">
                          <RiSearch2Line color="white" size={25}/>
                        </button>
                     </form>
                 </div>
          </div>
        </div>
        <div className="flex items-start justify-start w-full h-full bg-purple-600 p-10 ">
            <span className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-start gap-10 md:gap-20 max-w-[1400px] mx-auto w-full">
               {requirements.map((requirement,index) => (
                <div key={index} className="flex  items-center gap-4">
                    <img src={requirement.img} alt="skill" className="w-[60px] h-[60px] brightness-0 invert object-cover"/>
                    <h3 className="text-xl text-white font-semibold">{requirement.title}</h3>
                </div>
              ))}
            </span>
        </div>
      </main>
    </>
  );
};

export default LandingPage;