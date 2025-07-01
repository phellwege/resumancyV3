import React from "react";
import { useUser } from "../../../context/UserContext";
import "../../../views/main.css";

export default function ResumeStyle6({ isGenPDF }) {
  const {
    user,
    stripFormatting,
    selectedResume
  } = useUser();

  // Format the name
  const displayName = `${user.firstName?.charAt(0).toUpperCase() + user.firstName?.slice(1)} ${user.lastName?.charAt(0).toUpperCase() + user.lastName?.slice(1)}`;

  // Utility: safely render multiline text as separate <p> tags
  const renderMultiline = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => (
      <p key={i} style={{ margin: 0, fontSize: '8pt', marginBottom: '2px' }}>
        {line}
      </p>
    ));
  };

  return (
    <div className="resume-container" id="newResumeTemplate">
      {/* Header: Name, Job Title, Contact Info */}
      <header className="resume-header">
        <div className="name-and-title">
          <h1 className="resume-name">{displayName}</h1>
          {user.jobTitle && <h2 className="resume-job-title">{user.jobTitle}</h2>}
        </div>
        
        <div className="contact-info">
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
          {/* Social Media Links */}
          {user.contactInfo?.socialMedia?.map((account, i) => (
            <a key={i} href={account.url} target="_blank" rel="noopener noreferrer">
              {account.name}
            </a>
          ))}
        </div>
      </header>

      {/* Main body: two columns */}
      <section className="resume-body">
        {/* Left column */}
        <div className="resume-left-col">
          {/* Address Section - Optional */}
          {user.address?.useAddress && (
            <div className="resume-section">
              <h3 className="left-section-title">Address</h3>
              <p style={{ margin: 0, fontSize: '8pt' }}>
                {user.address.city}, {user.address.state}
              </p>
            </div>
          )}
          
          {/* Education Section */}
          {selectedResume?.education && (
            <div className="resume-section">
              <h3 className="left-section-title">Education</h3>
              {renderMultiline(selectedResume.education)}
            </div>
          )}

          {/* Skills Section */}
          {selectedResume?.skills && (
            <div className="resume-section">
              <h3 className="left-section-title">Skills</h3>
              {renderMultiline(selectedResume.skills)}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="resume-right-col">
          {/* Summary Section */}
          {selectedResume?.summary && (
            <div className="resume-section">
              <h3 className="section-title">Summary</h3>
              {renderMultiline(selectedResume.summary)}
            </div>
          )}

          {/* Experience Section */}
          {selectedResume?.experience?.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Experience</h3>
              {selectedResume.experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: '9pt' }}>
                    {exp.expCompanyName} {exp.expTime && `| ${exp.expTime}`}
                  </p>
                  {exp.expJobTitle && (
                    <p style={{ margin: 0, fontSize: '8pt' }}>
                      {exp.expJobTitle}
                    </p>
                  )}
                  {exp.expDesc && renderMultiline(exp.expDesc)}
                </div>
              ))}
            </div>
          )}

          {/* Custom Sections */}
          {selectedResume?.customSections && selectedResume.customSections.map((section, sectionIndex) => (
            section.entries && section.entries.length > 0 && (
              <div key={`section-${sectionIndex}`} className="resume-section">
                <h3 className="section-title">{section.sectionName}</h3>
                {section.entries.map((entry, entryIndex) => (
                  <div key={`entry-${sectionIndex}-${entryIndex}`} style={{ marginBottom: '8px' }}>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: '9pt' }}>
                      {entry.title} {entry.timeframe && `| ${entry.timeframe}`}
                    </p>
                    {entry.subtitle && (
                      <p style={{ margin: 0, fontSize: '8pt' }}>
                        {entry.subtitle}
                      </p>
                    )}
                    {entry.description && renderMultiline(entry.description)}
                  </div>
                ))}
              </div>
            )
          ))}

          {/* Legacy Projects Section Support */}
          {!selectedResume?.customSections && selectedResume?.projects?.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Projects</h3>
              {selectedResume.projects.map((project, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: '9pt' }}>{project.projectTitle}</p>
                  {project.projectTime && `| ${project.projectTime}`}
                  {project.projectSummary && renderMultiline(project.projectSummary)}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
