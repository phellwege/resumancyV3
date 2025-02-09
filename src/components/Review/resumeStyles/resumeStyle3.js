import React from 'react';
import { useUser } from '../../../context/UserContext';
import '../../../views/main.css';

export default function ResumeStyle3({isGenPDF}) {
  const {
    stripFormatting,
    user,
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
                <p key={index} className={shouldIndent ? 'indented' : ''} style={{marginBottom: '5px'}}>{line}</p>
            );
        });
    }
    return null;
};

  return (
    <>
      <div className="cardInnerDiv" id='resumeStyle3'>
        <div className='resumeStyle3Header'>
          <h3>
            {capitalizeFirstLetter(user?.firstName)}{" "}{isGenPDF && <span>&nbsp;</span>}{capitalizeFirstLetter(user?.lastName)}
          </h3>
          <h5>
            {user.jobTitle}
          </h5>
          <div className='reviewDefaultResumeSections'>
                <div className='spreadHorizontally'>
                  <div>
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
                    </div>
                    <div>
                      <div>
                        <a 
                          href={`mailto:${user.contactInfo.email}`}
                          target="_blank"
                        >
                          {renderTextWithNewLines(user.contactInfo.email)}
                        </a>
                      </div>
                      <div>
                        <a
                          href={`tel:${stripFormatting(user.contactInfo.phone)}`}
                        >
                          {renderTextWithNewLines(user.contactInfo.phone)}
                        </a>
                      </div>
                    </div>
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
            </div>
        </div>
          <div >
            <div className="reviewDefaultResumeSections">
              <h5>Summary:</h5>
              {renderTextWithNewLines(selectedResume.summary)}
            </div>
            <div className='reviewSection3LowerSections'>
            <div className='reviewStyle3RightDiv'>
              <div className="reviewDefaultResumeSections" id='resumeStyle3ExperiencSection'>
                <h5>Experience:</h5>
                <span className="leftOrientedReviewSections">
                    {selectedResume.experience.map((exp, index) => (
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
                <h5>Education and Certifications:</h5>
                <span className="leftOrientedReviewSections">
                  {renderTextWithNewLines(selectedResume.education)}
                </span>
              </div>
              <div
                className="reviewDefaultResumeSections"
                id="lastReviewDefaultResumeSection"
              >
                <h5>Skills:</h5>
                <span className="leftOrientedReviewSections">
                  {renderTextWithNewLines(selectedResume.skills)}
                </span>
              </div>
            </div>
            </div>
          </div>
      </div>
    </>
  );
}