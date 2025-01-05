import React from 'react';
import { useUser } from '../../../context/UserContext';
import '../../../views/main.css';

export default function ResumeStyle2({isGenPDF}) {
  const {
    user
  } = useUser();

  const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};
const renderTextWithNewLines = (text) => {
    if (text) {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            const shouldIndent = line.startsWith('-');
            return (
                <p key={index} className={shouldIndent ? 'indented' : ''}>{line}
                </p>
            );
        });
    }
    return null;
};

  return (
    <>
    <div className='cardInnerDiv' id='resumeStyle2'>
      <div id='resumeStyle2Header'>
        <h2>
          {capitalizeFirstLetter(user?.firstName)}{" "}{isGenPDF && <span>&nbsp;</span>}{capitalizeFirstLetter(user?.lastName)}
        </h2>
        <h4>{user.jobTitle}</h4>
      </div>
      <div className='resumeStyleLowerWrap'>
        <div className='resumeStyleLeftBlock'>
          <div className='reviewDefaultResumeSections'>
            <h4>Contact Info:</h4>
            {renderTextWithNewLines(user.contactInfo.phone)}
            {renderTextWithNewLines(user.contactInfo.email)}
            {/* {renderTextWithNewLines(user.contactInfo.socialMedia)} */}
          </div>
          <div className='reviewDefaultResumeSections' id='lastReviewDefaultResumeSection'>
            <h4>Skills:</h4>
            <span className='leftOrientedReviewSections'>{renderTextWithNewLines(user.resume.skills)}</span>
          </div>
        </div>
        <div className='resumeStyleRightBlock'>
          <div className='reviewDefaultResumeSections'>
            <h4>Summary:</h4>
            {renderTextWithNewLines(user.resume.summary)}
          </div>
          <div className='reviewDefaultResumeSections'>
            <h4>Experience:</h4>
            <span className='leftOrientedReviewSections'>{renderTextWithNewLines(user.resume.experience)}</span>
          </div>
          <div className='reviewDefaultResumeSections' id='resumeStyle2Education'>
            <h4>Education and Certifications:</h4>
            <span className='leftOrientedReviewSections'>{renderTextWithNewLines(user.resume.education)}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}