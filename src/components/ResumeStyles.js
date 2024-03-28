import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css/bundle";
import { Pagination, Autoplay } from "swiper/modules";

import defaultResumeStyle from '../static/resumeStyleImgs/Jimmy_Bob_scratchResume.jpg';
import resumeStyle2 from '../static/resumeStyleImgs/Jimmy_Bob_scratchResume (1).jpg';
import resumeStyle3 from '../static/resumeStyleImgs/Jimmy_Bob_scratchResume (2).jpg';
import resumeStyle4 from '../static/resumeStyleImgs/Jimmy_Bob_scratchResume (3).jpg';
import resumeStyle5 from '../static/resumeStyleImgs/Jimmy_Bob_scratchResume (4).jpg';
export default function ResumeStyles() {
  return (
    <>
        <Swiper
            pagination={{
            dynamicBullets: true,
            }}
            modules={[Pagination, Autoplay]}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            className="sampleResumeSwiper"
        >
            <SwiperSlide>
                <div className='swiperSlideDiv'>
                    <h4>Default Style</h4>
                    <img src={defaultResumeStyle} alt='Default Resume Style'/>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className='swiperSlideDiv'>
                    <h4>Sleek Sophistication Style</h4>
                    <img src={resumeStyle2} alt='Sleek Sophistication Style'/>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className='swiperSlideDiv'>
                    <h4>Professional Prodigy</h4>
                    <img src={resumeStyle3} alt='Sleek Sophistication Style'/>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className='swiperSlideDiv'>
                    <h4>Elegant Edge</h4>
                    <img src={resumeStyle4} alt='Sleek Sophistication Style'/>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className='swiperSlideDiv'>
                    <h4>Executive Excellence</h4>
                    <img src={resumeStyle5} alt='Sleek Sophistication Style'/>
                </div>
            </SwiperSlide>
        </Swiper>
    </>
  )
}
