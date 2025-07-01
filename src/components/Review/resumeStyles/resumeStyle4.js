import React from "react";
import { useUser } from "../../../context/UserContext";
import "../../../views/main.css";

export default function ResumeStyle4({isGenPDF}) {
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
      const shouldIndent = line.startsWith('-') || line.startsWith('•');
      return (
        <p key={index} className={shouldIndent ? 'resume-style4-indented' : ''} style={{ margin: 0, fontSize: '8pt', marginBottom: '2px' }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div className="resume-style4-container">
      {/* Header with name and job title */}
      <header className="resume-style4-header">
        <h1 className="resume-style4-name">
          {capitalizeFirstLetter(user?.firstName)}{" "}
          {capitalizeFirstLetter(user?.lastName)}
        </h1>
        {user.jobTitle && <h2 className="resume-style4-job-title">{user.jobTitle}</h2>}
      </header>

      <div className="resume-style4-content">
        {/* Left Column - 70% */}
        <div className="resume-style4-left-column">
          {/* Summary Section */}
          {selectedResume?.summary && (
            <div className="resume-style4-section">
              <h3 className="resume-style4-section-title">Summary</h3>
              <div>{renderTextWithNewLines(selectedResume.summary)}</div>
            </div>
          )}

          {/* Experience Section */}
          {selectedResume?.experience && selectedResume.experience.length > 0 && (
            <div className="resume-style4-section">
              <h3 className="resume-style4-section-title">Experience</h3>
              {selectedResume.experience.map((exp, index) => (
                <div key={index} className="resume-style4-experience-item">
                  <div className="resume-style4-experience-header">
                    <h4 className="resume-style4-company-name">{exp.expCompanyName}</h4>
                    <span className="resume-style4-job-date">{exp.expTime}</span>
                  </div>
                  <p className="resume-style4-job-position">{exp.expJobTitle}</p>
                  <div>{renderTextWithNewLines(exp.expDesc)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Sections */}
          {selectedResume?.customSections && selectedResume.customSections.map((section, sectionIndex) => (
            section.entries && section.entries.length > 0 && (
              <div key={`section-${sectionIndex}`} className="resume-style4-section">
                <h3 className="resume-style4-section-title">{section.sectionName}</h3>
                {section.entries.map((entry, entryIndex) => (
                  <div key={`entry-${sectionIndex}-${entryIndex}`} className="resume-style4-experience-item">
                    <div className="resume-style4-experience-header">
                      <h4 className="resume-style4-company-name">{entry.title}</h4>
                      {entry.timeframe && <span className="resume-style4-job-date">{entry.timeframe}</span>}
                    </div>
                    {entry.subtitle && <p className="resume-style4-job-position">{entry.subtitle}</p>}
                    <div>{renderTextWithNewLines(entry.description)}</div>
                  </div>
                ))}
              </div>
            )
          ))}

          {/* Legacy Projects Section Support */}
          {!selectedResume?.customSections && selectedResume?.projects && selectedResume.projects.length > 0 && (
            <div className="resume-style4-section">
              <h3 className="resume-style4-section-title">Projects</h3>
              {selectedResume.projects.map((project, index) => (
                <div key={index} className="resume-style4-experience-item">
                  <div className="resume-style4-experience-header">
                    <h4 className="resume-style4-company-name">{project.projectTitle}</h4>
                    {project.projectTime && <span className="resume-style4-job-date">{project.projectTime}</span>}
                  </div>
                  <div>{renderTextWithNewLines(project.projectSummary)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - 30% with gray background */}
        <div className="resume-style4-right-column">
          {/* Contact Info Section */}
          <div className="resume-style4-section">
            <h3 className="resume-style4-section-title">Contact Info</h3>
            {user.contactInfo?.email && (
              <a href={`mailto:${user.contactInfo.email}`} style={{ display: 'block', marginBottom: '2px' }}>
                {user.contactInfo.email}
              </a>
            )}
            {user.contactInfo?.phone && (
              <a href={`tel:${stripFormatting(user.contactInfo.phone)}`} style={{ display: 'block', marginBottom: '2px' }}>
                {user.contactInfo.phone}
              </a>
            )}
            {user.contactInfo?.socialMedia && user.contactInfo.socialMedia.length > 0 &&
              user.contactInfo.socialMedia.map((account, index) => (
                <a key={index} href={account.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: '2px' }}>
                  {account.name}
                </a>
              ))}
          </div>
          
          {/* Address Section if available */}
          {user.address?.useAddress && (
            <div className="resume-style4-section">
              <h3 className="resume-style4-section-title">Address</h3>
              <p style={{ margin: 0, fontSize: '8pt' }}>
                {user.address.city}, {user.address.state}
              </p>
            </div>
          )}
          
          {/* Skills Section */}
          {selectedResume?.skills && (
            <div className="resume-style4-section">
              <h3 className="resume-style4-section-title">Skills</h3>
              <div>{renderTextWithNewLines(selectedResume.skills)}</div>
            </div>
          )}

          {/* Education Section */}
          {selectedResume?.education && (
            <div className="resume-style4-section">
              <h3 className="resume-style4-section-title">Education</h3>
              <div>{renderTextWithNewLines(selectedResume.education)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}