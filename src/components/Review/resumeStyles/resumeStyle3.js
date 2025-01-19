import React from 'react';
import { useUser } from '../../../context/UserContext';
import '../../../views/main.css';

export default function ResumeStyle3({isGenPDF}) {
  const {
    stripFormatting,
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
                <p key={index} className={shouldIndent ? 'indented' : ''}>{line}</p>
            );
        });
    }
    return null;
};

  return (
    <>
      <div className="cardInnerDiv" id='resumeStyle3'>
        <div className='resumeStyle3Header'>
          <h2>
            {capitalizeFirstLetter(user?.firstName)}{" "}{isGenPDF && <span>&nbsp;</span>}{capitalizeFirstLetter(user?.lastName)}
          </h2>
          <h4>
            {user.jobTitle}
          </h4>
          <div className='reviewDefaultResumeSections'>
                <h4>Contact Info:</h4>
                <a 
                    href={`mailto:${user.contactInfo.email}`}
                    target="_blank"
                >
                    {renderTextWithNewLines(user.contactInfo.email)}
                </a>
                <a
                    href={`tel:${stripFormatting(user.contactInfo.phone)}`}
                >
                    {renderTextWithNewLines(user.contactInfo.phone)}
                </a>
                {user.contactInfo.socialMedia.length > 0 && (
                    <div className='socialMediaLinks'>
                        {user.contactInfo.socialMedia.map((account, index) => (
                            <div key={index}>
                                <a 
                                    href={account.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {account.name}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                {user.resume.usage.useAddress && (
                    <div className='reviewAddress'>
                        {user.address.street}{' '}
                        {user.address.appt}
                        <br/>
                        {user.address.city}
                        <br/>
                        {user.address.state}
                        {' '}
                        {user.address.zip}
                    </div>
                )}
            </div>
        </div>
          <div >
            <div className="reviewDefaultResumeSections">
              <h4>Summary:</h4>
              {renderTextWithNewLines(user.resume.summary)}
            </div>
            <div className='reviewSection3LowerSections'>
            <div className='reviewStyle3RightDiv'>
              <div className="reviewDefaultResumeSections" id='resumeStyle3ExperiencSection'>
                <h4>Experience:</h4>
                <span className="leftOrientedReviewSections">
                    {user.resume.experience.map((exp, index) => (
                        <div key={index} className="experience-entry">
                            <h6 className='leftOrientedReviewSections spacing'>{renderTextWithNewLines(exp.expCompanyName)}</h6>
                            <div className='reviewResumeJobTitleAndTime'>
                                <h6 className='leftOrientedReviewSections'>{renderTextWithNewLines(exp.expJobTitle)}</h6>
                                <h6 className='leftOrientedReviewSections'>{renderTextWithNewLines(exp.expTime)}</h6>
                            </div>
                            <span className='leftOrientedReviewSections'>{renderTextWithNewLines(exp.expDesc)}</span>
                        </div>
                    ))}
                </span>
              </div>
            </div>
            <div className='reviewStyle3LeftDiv'>
              <div className="reviewDefaultResumeSections">
                <h4>Education and Certifications:</h4>
                <span className="leftOrientedReviewSections">
                  {renderTextWithNewLines(user.resume.education)}
                </span>
              </div>
              <div
                className="reviewDefaultResumeSections"
                id="lastReviewDefaultResumeSection"
              >
                <h4>Skills:</h4>
                <span className="leftOrientedReviewSections">
                  {renderTextWithNewLines(user.resume.skills)}
                </span>
              </div>
            </div>
            </div>
          </div>
      </div>
    </>
  );
}