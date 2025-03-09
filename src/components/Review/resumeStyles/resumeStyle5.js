import React from 'react';
import { useUser } from '../../../context/UserContext';
import '../../../views/main.css';

export default function ResumeStyle5({isGenPDF}) {
  const {
    stripFormatting,
    user,
    selectedResume
  } = useUser();

  const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const renderTextWithNewLines = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const shouldIndent = line.startsWith('-');
      return (
        <p key={index} className={shouldIndent ? 'indented' : ''} style={{ margin: 0, fontSize: '8pt', marginBottom: '2px' }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div className="resume-style5-container">
      <div className="resume-style5-content">
        {/* Left column */}
        <div className="resume-style5-left-column">
          <div className="resume-style5-name-title">
            <h1 className="resume-style5-name">
              {capitalizeFirstLetter(user?.firstName)}{" "}
              {capitalizeFirstLetter(user?.lastName)}
            </h1>
            {user.jobTitle && <h2 className="resume-style5-job-title">{user.jobTitle}</h2>}
          </div>

          {/* Contact Info Section */}
          <div className="resume-style5-section">
            <h3 className="resume-style5-section-title">Contact Info</h3>
            <div className="resume-style5-contact-info">
              {user.contactInfo?.email && (
                <a href={`mailto:${user.contactInfo.email}`} target="_blank" rel="noopener noreferrer">
                  {user.contactInfo.email}
                </a>
              )}
              {user.contactInfo?.phone && (
                <a href={`tel:${stripFormatting(user.contactInfo.phone)}`} target="_blank" rel="noopener noreferrer">
                  {user.contactInfo.phone}
                </a>
              )}
              {user.contactInfo?.location && (
                <a href={`https://maps.google.com/?q=${user.contactInfo.location}`} target="_blank" rel="noopener noreferrer">
                  {user.contactInfo.location}
                </a>
              )}
              {user.contactInfo?.linkedin && (
                <a href={user.contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {user.contactInfo?.github && (
                <a href={user.contactInfo.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {user.contactInfo?.portfolio && (
                <a href={user.contactInfo.portfolio} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              )}
              {user.contactInfo?.socialMedia && user.contactInfo.socialMedia.length > 0 &&
                user.contactInfo.socialMedia.map((account, index) => (
                  <a key={index} href={account.url} target="_blank" rel="noopener noreferrer">
                    {account.name}
                  </a>
                ))}
            </div>
          </div>

          {/* Address Section */}
          {user.address?.useAddress && (
            <div className="resume-style5-section">
              <h3 className="resume-style5-section-title">Address</h3>
              <p style={{ margin: 0, fontSize: '8pt' }}>
                {user.address.city}, {user.address.state}
              </p>
            </div>
          )}

          {/* Skills Section */}
          <div className="resume-style5-section">
            <h3 className="resume-style5-section-title">Skills</h3>
            {renderTextWithNewLines(selectedResume?.skills)}
          </div>

          {/* Education Section */}
          <div className="resume-style5-section">
            <h3 className="resume-style5-section-title">Education</h3>
            {renderTextWithNewLines(selectedResume?.education)}
          </div>
        </div>

        {/* Right column */}
        <div className="resume-style5-right-column">
          {/* Summary Section */}
          <div className="resume-style5-section">
            <h3 className="resume-style5-section-title">Summary</h3>
            {renderTextWithNewLines(selectedResume?.summary)}
          </div>

          {/* Experience Section */}
          <div className="resume-style5-section">
            <h3 className="resume-style5-section-title">Experience</h3>
            {selectedResume?.experience?.map((exp, index) => (
              <div key={index} className="resume-style5-experience-item">
                <div className="resume-style5-experience-header">
                  <p className="resume-style5-company-name">
                    {exp.expCompanyName}
                  </p>
                  {exp.expTime && (
                    <p className="resume-style5-job-date">
                      {exp.expTime}
                    </p>
                  )}
                </div>
                {exp.expJobTitle && (
                  <p className="resume-style5-job-position">
                    {exp.expJobTitle}
                  </p>
                )}
                {exp.expDesc && renderTextWithNewLines(exp.expDesc)}
              </div>
            ))}
          </div>

          {/* Projects Section */}
          {selectedResume?.projects?.length > 0 && (
            <div className="resume-style5-section">
              <h3 className="resume-style5-section-title">Projects</h3>
              {selectedResume.projects.map((project, index) => (
                <div key={index} className="resume-style5-project-item">
                  <p className="resume-style5-project-title">{project.title}</p>
                  {project.description && renderTextWithNewLines(project.description)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}