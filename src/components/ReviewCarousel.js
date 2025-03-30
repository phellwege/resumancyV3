import React from 'react';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { FaStar } from 'react-icons/fa';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Sample review data - you can replace this with actual data from your backend
const reviewsData = [
  {
    id: 1,
    name: 'Pewmanchu',
    rating: 5,
    text: 'This is my current go to as far as for updating my resume, in terms of formatting options and the results. I work in the IT field specifically contracting. This has made the interview process my last 3 contracts in the past 2 years a breeze. Use the Trial period and test it for yourself its free!',
  },
  {
    id: 2,
    name: 'S C',
    rating: 5,
    text: 'This was so helpful for updating my resume. It was quick and easy, and it was able to give me several different versions to fit the needs of which position I was applying for. It works differently than other resume builder websites I was looking at and I didn\'t have to type a bunch of AI prompts. They also don\'t sell data. I had a chat with the guy that created it and he\'s awesome!',
  }
];

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 10px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color || '#e91e63'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
`;

const UserInfo = styled.div`
  // flex: 1;
`;

const UserName = styled.h5`
  margin: 0;
  font-weight: 600;
`;

const StarRating = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const ReviewText = styled.p`
  flex: 1;
  line-height: 1.5;
`;

const NewBadge = styled.span`
  background-color: #333;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
`;

const ReviewCarousel = () => {
  // Function to render stars based on rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <FaStar key={index} color={index < rating ? '#FFD700' : '#e4e5e9'} size={18} />
    ));
  };

  // Function to get avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50'];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  return (
    <Swiper
      modules={[Pagination, Autoplay, Navigation]}
      spaceBetween={30}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      navigation={true}
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
      }}
    >
      {reviewsData.map((review) => (
        <SwiperSlide key={review.id}>
          <StyledCard>
            <ReviewHeader>
              <Avatar color={getAvatarColor(review.name)}>
                {review.name.charAt(0)}
              </Avatar>
              <UserInfo>
                <UserName>{review.name}</UserName>
              </UserInfo>
            </ReviewHeader>
            <StarRating>
              {renderStars(review.rating)}
            </StarRating>
            <ReviewText>{review.text}</ReviewText>
          </StyledCard>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ReviewCarousel;
