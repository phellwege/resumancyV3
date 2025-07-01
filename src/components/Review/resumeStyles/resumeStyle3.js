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
          <h6>
            {user.jobTitle}
          </h6>
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
              <h6>Summary:</h6>
              {renderTextWithNewLines(selectedResume.summary)}
            </div>
            <div className='reviewSection3LowerSections'>
            <div className='reviewStyle3RightDiv'>
              <div className="reviewDefaultResumeSections" id='resumeStyle3ExperiencSection'>
                <h6>Experience:</h6>
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
                <h6>Education and Certifications:</h6>
                <span className="leftOrientedReviewSections">
                  {renderTextWithNewLines(selectedResume.education)}
                </span>
              </div>
              <div
                className="reviewDefaultResumeSections"
                id="lastReviewDefaultResumeSection"
              >
                <h6>Skills:</h6>
                <span className="leftOrientedReviewSections">
                  {renderTextWithNewLines(selectedResume.skills)}
                </span>
              </div>
              {/* Custom Sections */}
              {selectedResume?.customSections && selectedResume.customSections.map((section, sectionIndex) => (
                section.entries && section.entries.length > 0 && (
                  <div key={`section-${sectionIndex}`} className="reviewDefaultResumeSections">
                    <h6>{section.sectionName}:</h6>
                    <span className="leftOrientedReviewSections">
                      {section.entries.map((entry, entryIndex) => (
                        <div key={`entry-${sectionIndex}-${entryIndex}`} className="experience-entry">
                          <h6 className='leftOrientedReviewSections spacing'>{renderTextWithNewLines(entry.title)}</h6>
                          <div className='reviewResumeJobTitleAndTime'>
                            {entry.subtitle && <h6 className='leftOrientedReviewSections'>{renderTextWithNewLines(entry.subtitle)}</h6>}
                            {entry.timeframe && <h6 className='leftOrientedReviewSections'>{renderTextWithNewLines(entry.timeframe)}</h6>}
                          </div>
                          <span className='leftOrientedReviewSections'>{renderTextWithNewLines(entry.description)}</span>
                        </div>
                      ))}
                    </span>
                  </div>
                )
              ))}
              {/* Legacy Projects Section Support */}
              {!selectedResume?.customSections && selectedResume?.projects && selectedResume.projects.length > 0 && (
                <div className="reviewDefaultResumeSections">
                  <h6>Projects:</h6>
                  <span className="leftOrientedReviewSections">
                    {selectedResume.projects.map((project, index) => (
                      <div key={index} className="experience-entry">
                        <h6 className='leftOrientedReviewSections spacing'>{renderTextWithNewLines(project.projectTitle)}</h6>
                        {project.projectTime && <h6 className='leftOrientedReviewSections'>{renderTextWithNewLines(project.projectTime)}</h6>}
                        <span className='leftOrientedReviewSections'>{renderTextWithNewLines(project.projectSummary)}</span>
                      </div>
                    ))}
                  </span>
                </div>
              )}
            </div>
            </div>
          </div>
      </div>
    </>
  );
}