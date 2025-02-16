import React, {useState} from 'react'
import { Table, OverlayTrigger, Tooltip, Pagination} from 'react-bootstrap';
import { Link } from "react-router-dom";

import ReviewResumeModal from './ReviewResumeModal';
import ReviewCoverLetterModal from './ReviewCoverLetterModal'
import ReviewJobDescModal from './ReviewJobDescModal';
import GapAnalysisModal from '../GapAnalysisModal';
import { BsQuestionCircle } from "react-icons/bs";

import { useUser } from '../../context/UserContext';
import { useData } from '../../context/DataContext';

export default function TailoredResumeTable() {
  const {
    user,
    handleOpenReviewResumeModal,
    handleOpenReviewCoverLetterModal,
    handleOpenReviewJobDescModal,
    setSelectedResumeId,
    setSelectedTailoredResumeId,
    setSelectedCoverLetterId,
    handleOpenGapAnalysisModal
  } = useUser();
  const {
    readyTailoredResume
  } = useData();

  const companyNameDesc = "The company this tailored resume is intended for.";
  const jobDescDesc = "A copy of the job description you provided.";
  const resumeDesc = "Your resume customized for this specific job.";
  const coverLetterDesc = "The cover letter generated for this position.";
  const dateDesc = "The date this tailored resume was created.";
  const matchDesc = "How closely your tailored resume matches the job description. Click to view a detailed skill gap analysis and improvement steps.";
  
  const matchOnHoverToolTip = "Click to view a skill gap analysis with actionable steps for improving your tailored resume."
  const jobDescOnHoverToolTip = "Click to view a copy of the job description you provided."
  const resumeDescOnHoverToolTip = "Click to view Your resume customized for this specific job."
  const coverLetterDescOnHoverToolTip = "Click to view a cover letter generated for this position."

      // const [resumes, setResumes] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 10;

      const handleViewResume = (resumeId) => {
        setSelectedResumeId(resumeId);
        handleOpenReviewResumeModal();
      };
      const handleViewCoverLetter = (resumeId) => {
        setSelectedCoverLetterId(resumeId);
        handleOpenReviewCoverLetterModal();
      };
      const handleViewJobDesc = (resumeId) => {
        setSelectedTailoredResumeId(resumeId);
        handleOpenReviewJobDescModal();
    };

  // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const sortedResumes = [...readyTailoredResume].sort((a, b) => 
      new Date(b.usage.timeStamp) - new Date(a.usage.timeStamp)
    );
    const currentItems = sortedResumes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(readyTailoredResume.length / itemsPerPage);
  return (
    <>
    <ReviewResumeModal />
    <ReviewCoverLetterModal />
    <ReviewJobDescModal />
    <GapAnalysisModal />
        <>
        <h5>Tailored Resume(s)</h5>
        {readyTailoredResume.length > 0 && (
          <p >
            Showing {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, readyTailoredResume.length)} of {readyTailoredResume.length} records
          </p>
        )}
  
        <Table striped bordered hover variant='dark'>
            <thead>
            <tr>
                <th>
                  Company Name
                  <OverlayTrigger 
                      overlay={
                      <Tooltip id="tooltip">
                          {companyNameDesc}
                      </Tooltip>
                      }>
                      <span className="question-icon">
                          <BsQuestionCircle />
                      </span>
                  </OverlayTrigger>
                </th>
                <th>
                  Job Description
                  <OverlayTrigger 
                      overlay={
                      <Tooltip id="tooltip">
                          {jobDescDesc}
                      </Tooltip>
                      }>
                      <span className="question-icon">
                          <BsQuestionCircle />
                      </span>
                  </OverlayTrigger>
                </th>
                <th>
                  Resume
                  <OverlayTrigger 
                      overlay={
                      <Tooltip id="tooltip">
                          {resumeDesc}
                      </Tooltip>
                      }>
                      <span className="question-icon">
                          <BsQuestionCircle />
                      </span>
                  </OverlayTrigger>
                </th>
                <th>
                  Cover Letter
                  <OverlayTrigger 
                      overlay={
                      <Tooltip id="tooltip">
                          {coverLetterDesc}
                      </Tooltip>
                      }>
                      <span className="question-icon">
                          <BsQuestionCircle />
                      </span>
                  </OverlayTrigger>
                </th>
                <th>
                  Date
                  <OverlayTrigger 
                      overlay={
                      <Tooltip id="tooltip">
                          {dateDesc}
                      </Tooltip>
                      }>
                      <span className="question-icon">
                          <BsQuestionCircle />
                      </span>
                  </OverlayTrigger>
                </th>
                <th>
                  Match %
                  <OverlayTrigger 
                      overlay={
                      <Tooltip id="tooltip">
                          {matchDesc}
                      </Tooltip>
                      }>
                      <span className="question-icon">
                          <BsQuestionCircle />
                      </span>
                  </OverlayTrigger>
                </th>
            </tr>
            </thead>
            <tbody>
            {currentItems.map((resume) => (
              <tr key={resume.id}>
                <td>{resume.companyName}</td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip">
                        {jobDescOnHoverToolTip}
                      </Tooltip>
                    }
                  >
                    <Link to='' className='tailoredResumeMatch' onClick={() => handleViewJobDesc(resume.id)}>
                      Job Description
                    </Link>
                  </OverlayTrigger>
                </td>
                <td>
                <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip">
                        {resumeDescOnHoverToolTip}
                      </Tooltip>
                    }
                  >
                  <Link to='' className='tailoredResumeMatch' onClick={() => handleViewResume(resume.id)}>
                    Tailored Resume
                  </Link>
                  </OverlayTrigger>
                </td>
                <td>
                <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip">
                        {coverLetterDescOnHoverToolTip}
                      </Tooltip>
                    }
                  >
                  <Link to='' className='tailoredResumeMatch' onClick={() => handleViewCoverLetter(resume.id)}>
                    Cover Letter
                  </Link>
                  </OverlayTrigger>
                </td>
                <td>
                  {resume.usage.timeStamp
                    ? new Intl.DateTimeFormat("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(resume.usage.timeStamp))
                    : "NA"
                  }
                </td>
                <td>
                {resume.matchPercent ? (
                  resume.skillGapAnalysis ? (
                    <OverlayTrigger
                      overlay={
                        <Tooltip id="tooltip">
                          {matchOnHoverToolTip}
                        </Tooltip>
                      }
                    >
                    <a className='tailoredResumeMatch'
                      onClick={() => {
                        // Open modal to display gap analysis details.
                        handleOpenGapAnalysisModal(resume.skillGapAnalysis);
                      }}
                    >
                      {resume.matchPercent}%
                    </a>
                    </OverlayTrigger>
                  ) : (
                    <span>{resume.matchPercent}%</span>
                  )
                ) : (
                  "N/A"
                )}
                </td>
              </tr>
            ))}
            </tbody>
        </Table>
  
        {readyTailoredResume.length > itemsPerPage && (
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </Pagination>
        )}
        </>
    </>
  )
}
