import React from 'react';
import { useUser } from '../../../context/UserContext';
import '../../../views/main.css';

export default function ResumeStyle2({ isGenPDF }) {
  const {
    user,
    stripFormatting,
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
    <div className="resume-style2-container">
      {/* Header with name and job title */}
      <div className="resume-style2-header">
        <h1 className="resume-style2-name">
          {capitalizeFirstLetter(user?.firstName)}{" "}{capitalizeFirstLetter(user?.lastName)}
        </h1>
        {user.jobTitle && <h2 className="resume-style2-job-title">{user.jobTitle}</h2>}
        <div className="resume-style2-header-line"></div>
      </div>

      {/* Main content with two columns */}
      <div className="resume-style2-content">
        {/* Left column */}
        <div className="resume-style2-left-column">
          {/* Contact Info Section */}
          <div className="resume-style2-section">
            <h3 className="resume-style2-section-title">Contact Info</h3>
            <div className="resume-style2-contact-info">
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
            <div className="resume-style2-section">
              <h3 className="resume-style2-section-title">Address</h3>
              <p style={{ margin: 0, fontSize: '8pt' }}>
                {user.address.street && `${user.address.street}, `}{user.address.city}, {user.address.state}{user.address.zip && ` ${user.address.zip}`}
              </p>
            </div>
          )}
          
          {/* Skills Section */}
          <div className="resume-style2-section">
            <h3 className="resume-style2-section-title">Skills</h3>
            {renderTextWithNewLines(selectedResume?.skills)}
          </div>

          {/* Education Section */}
          <div className="resume-style2-section">
            <h3 className="resume-style2-section-title">Education</h3>
            {renderTextWithNewLines(selectedResume?.education)}
          </div>
        </div>

        {/* Right column */}
        <div className="resume-style2-right-column">
          {/* Summary Section */}
          <div className="resume-style2-section">
            <h3 className="resume-style2-section-title">Summary</h3>
            {renderTextWithNewLines(selectedResume?.summary)}
          </div>

          {/* Experience Section */}
          <div className="resume-style2-section">
            <h3 className="resume-style2-section-title">Experience</h3>
            {selectedResume?.experience?.map((exp, index) => (
              <div key={index} className="resume-style2-experience-item">
                <p className="resume-style2-company-name">
                  {exp.expCompanyName} {exp.expTime && `| ${exp.expTime}`}
                </p>
                {exp.expJobTitle && (
                  <p className="resume-style2-job-position">
                    {exp.expJobTitle}
                  </p>
                )}
                {exp.expDesc && renderTextWithNewLines(exp.expDesc)}
              </div>
            ))}
          </div>

          {/* Custom Sections */}
          {selectedResume?.customSections?.map((section, sectionIndex) => (
            section.entries && section.entries.length > 0 && (
              <div key={`section-${sectionIndex}`} className="resume-style2-section">
                <h3 className="resume-style2-section-title">{section.sectionName}</h3>
                {section.entries.map((entry, entryIndex) => (
                  <div key={`entry-${sectionIndex}-${entryIndex}`} className="resume-style2-experience-item">
                    <p className="resume-style2-company-name">
                      {entry.title} {entry.timeframe && `| ${entry.timeframe}`}
                    </p>
                    {entry.subtitle && (
                      <p className="resume-style2-job-position">
                        {entry.subtitle}
                      </p>
                    )}
                    {entry.description && renderTextWithNewLines(entry.description)}
                  </div>
                ))}
              </div>
            )
          ))}
          
          {/* Legacy Projects Section Support */}
          {!selectedResume?.customSections && selectedResume?.projects?.length > 0 && (
            <div className="resume-style2-section">
              <h3 className="resume-style2-section-title">Projects</h3>
              {selectedResume.projects.map((project, index) => (
                <div key={index} className="resume-style2-project-item">
                  <p className="resume-style2-project-title">
                    {project.projectTitle} {project.projectTime && `| ${project.projectTime}`}
                  </p>
                  {project.projectSummary && renderTextWithNewLines(project.projectSummary)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}