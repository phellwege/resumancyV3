import React from 'react';
import { useUser } from '../../../context/UserContext';
import '../../../views/main.css';

export default function ResumeStyle2({isGenPDF}) {
  const {
    user,
    stripFormatting,
    selectedResume
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
                <p key={index} className={shouldIndent ? 'indented' : ''} style={{ marginBottom: "2px" }}>{line}
                </p>
            );
        });
    }
    return null;
};

  return (
    <>
    <div className='reviewHeight'>
        <div className='cardInnerDiv' id='resumeStyle2'>
        <div id='resumeStyle2Header'>
            <h3>
            {capitalizeFirstLetter(user?.firstName)}{" "}{isGenPDF && <span>&nbsp;</span>}{capitalizeFirstLetter(user?.lastName)}
            </h3>
            <h6>{user.jobTitle}</h6>
        </div>
        <div className='resumeStyleLowerWrap'>
            <div className='resumeStyleLeftBlock'>
            <div className='reviewDefaultResumeSections'>
                <h6>Contact Info:</h6>
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
                <br/>
                {user.address?.useAddress && (
                    <div className="reviewAddress">
                        <h6 className="mb-0">Address:</h6>
                        <p className="mb-1">
                            {user.address.street && `${user.address.street} `}
                            {user.address.appt && user.address.appt}
                            <br />
                            {user.address.city && `${user.address.city}`}
                            {user.address.state && `, ${user.address.state}`}
                            {user.address.zip && ` ${user.address.zip}`}
                        </p>
                    </div>
                )}
            </div>
            <div className='reviewDefaultResumeSections' id='lastReviewDefaultResumeSection'>
                <h6>Skills:</h6>
                <span className='leftOrientedReviewSections'>{renderTextWithNewLines(selectedResume?.skills)}</span>
                <div className='reviewDefaultResumeSections' id='resumeStyle2Education'>
                <h6>Education and Certifications:</h6>
                <span className='leftOrientedReviewSections'>{renderTextWithNewLines(selectedResume?.education)}</span>
            </div>
            </div>
            </div>
            <div className='resumeStyleRightBlock'>
                <div className='reviewDefaultResumeSections'>
                <h6>Summary:</h6>
                {renderTextWithNewLines(selectedResume?.summary)}
            </div>
            <div className='reviewDefaultResumeSections'>
                <h6>Experience:</h6>
                {selectedResume?.experience.map((exp, index) => (
                    <div key={index} className="experience-entry">
                        <h6 className='leftOrientedReviewSections spacing'>{renderTextWithNewLines(exp.expCompanyName)}</h6>
                        <div className='reviewResumeJobTitleAndTime'>
                            <h6 className='leftOrientedReviewSections'>{renderTextWithNewLines(exp.expJobTitle)}</h6>
                            <h6 className='leftOrientedReviewSections'>{renderTextWithNewLines(exp.expTime)}</h6>
                        </div>
                        <span className='leftOrientedReviewSections'>{renderTextWithNewLines(exp.expDesc)}</span>
                    </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    </div>
    </>
  )
}