import React from 'react';
import { useUser } from '../../../context/UserContext';
import '../../../views/main.css';

export default function DefaultResumeStyle({isGenPDF}) {
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
                    <p key={index} className={shouldIndent ? 'indented' : ''} style={{marginBottom: '5px'}}>{line}</p>
                );
            });
        }
        return null;
    };
    
    return (
        <>
        <div className='cardInnerDiv' id='defaultResumeWrap'>
            <h3>{capitalizeFirstLetter(user.firstName)}{" "}{isGenPDF && <span>&nbsp;</span>}{capitalizeFirstLetter(user.lastName)}</h3>
            <h5>{user.jobTitle}</h5>
                <div>
                    <div className='reviewDefaultResumeSections'>
                        <h5>Contact Info:</h5>
                        <a
                            href={`tel:${stripFormatting(user.contactInfo.phone)}`}
                        >
                            {renderTextWithNewLines(user.contactInfo.phone)}
                        </a>
                        <a 
                            href={`mailto:${user.contactInfo.email}`}
                            target="_blank"
                        >
                            {renderTextWithNewLines(user.contactInfo.email)}
                        </a>
                    </div>
                    <div className='reviewDefaultResumeSections'>
                        <h5>Summary:</h5>
                        {renderTextWithNewLines(selectedResume.summary)}
                    </div>
                    <div className='reviewDefaultResumeSections'>
                    <h5>Experience:</h5>
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
                    </div>
                    <div className='reviewDefaultResumeSections'>
                        <h5>Education and Certifications:</h5>
                        <span className='leftOrientedReviewSections'>{renderTextWithNewLines(selectedResume.education)}</span>
                    </div>
                    <div className='reviewDefaultResumeSections' id='lastReviewDefaultResumeSection'>
                        <h5>Skills:</h5>
                        <span className='leftOrientedReviewSections'>{renderTextWithNewLines(selectedResume.skills)}</span>
                    </div>
                </div>
        </div>
        </>
    )
}