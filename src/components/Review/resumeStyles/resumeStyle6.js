import React from "react";
import { useUser } from "../../../context/UserContext";
import "../../../views/main.css";

export default function ResumeStyle6({ isGenPDF }) {
  const {
    user,               // e.g., { firstName, lastName, contactInfo, etc. }
    selectedResume      // e.g., { education, summary, skills, experience, projects }
  } = useUser();

  // Utility: safely render multiline text as separate <p> tags
  const renderMultiline = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => (
      <p key={i} style={{ margin: 0 }}>
        {line}
      </p>
    ));
  };

  // Example: capitalize first letter of firstName/lastName
  const displayName = `${user.firstName?.charAt(0).toUpperCase() + user.firstName?.slice(1)} 
    ${user.lastName?.charAt(0).toUpperCase() + user.lastName?.slice(1)}`;

  return (
    <div className="resume-container" id="newResumeTemplate">
      {/* Resume Header */}
      <header className="resume-header">
        <div className="name-and-title">
          <h1 className="resume-name">{displayName}</h1>
          {/* Optionally display a job title if you have it */}
          {user.jobTitle && <h2 className="resume-job-title">{user.jobTitle}</h2>}
        </div>

        <div className="contact-info">
          {/* Example contact fields: email, phone, website, etc. */}
          {user.contactInfo?.email && <a href={`mailto:${user.contactInfo.email}`}>{user.contactInfo.email}</a>}
          {user.contactInfo?.phone && <a href={`tel:${user.contactInfo.phone}`}>{user.contactInfo.phone}</a>}
          {/* Social links */}
          {user.contactInfo?.socialMedia?.map((account, i) => (
            <span key={i}>
              <a href={account.url} target="_blank" rel="noopener noreferrer">
                {account.name}
              </a>
            </span>
          ))}
        </div>
      </header>

      {/* Main body: two columns */}
      <section className="resume-body">
        {/* LEFT COLUMN */}
        <div className="resume-left-col">
          {/* EDUCATION */}
          {selectedResume?.education && (
            <div className="resume-section">
              <h3 className="section-title">Education</h3>
              {renderMultiline(selectedResume.education)}
            </div>
          )}

          {/* SKILLS */}
          {selectedResume?.skills && (
            <div className="resume-section">
              <h3 className="section-title">Skills</h3>
              {renderMultiline(selectedResume.skills)}
            </div>
          )}

          {/* PROJECTS */}
          {selectedResume?.projects?.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Projects</h3>
              {selectedResume.projects.map((proj, index) => (
                <div key={index} className="project-entry">
                  <h4 className="project-title">{proj.title}</h4>
                  {renderMultiline(proj.description)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="resume-right-col">
          {/* SUMMARY */}
          {selectedResume?.summary && (
            <div className="resume-section">
              <h3 className="section-title">Summary</h3>
              {renderMultiline(selectedResume.summary)}
            </div>
          )}

          {/* EMPLOYMENT / EXPERIENCE */}
          {selectedResume?.experience?.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Employment</h3>
              {selectedResume.experience.map((exp, index) => (
                <div key={index} className="experience-entry">
                  <h4 className="experience-company">
                    {exp.expCompanyName} | {exp.expTime}
                  </h4>
                  <h5 className="experience-job-title">
                    {exp.expJobTitle}
                  </h5>
                  {renderMultiline(exp.expDesc)}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
