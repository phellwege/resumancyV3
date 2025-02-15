import React, {useEffect, useState} from 'react'
import { Button, Card, Alert, Table, OverlayTrigger, Tooltip, Pagination} from 'react-bootstrap';
import { Link } from "react-router-dom";

import ReviewResumeModal from './ReviewResumeModal';
import ReviewCoverLetterModal from './ReviewCoverLetterModal'
import ReviewJobDescModal from './ReviewJobDescModal';

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
    setSelectedCoverLetterId
  } = useUser();
  const {
    readyTailoredResume
  } = useData();

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
                <th>Company Name</th>
                <th>Job Description</th>
                <th>Resume</th>
                <th>Cover Letter</th>
                <th>Date</th>
                <th>Match %</th>
            </tr>
            </thead>
            <tbody>
            {currentItems.map((resume) => (
              <tr key={resume.id}>
                <td>{resume.companyName}</td>
                <td>
                  <Link to='' onClick={() => handleViewJobDesc(resume.id)}>
                    View Job Description
                  </Link>
                </td>
                <td>
                  <Link to='' onClick={() => handleViewResume(resume.id)}>
                    View Tailored Resume
                  </Link>
                </td>
                <td>
                  <Link to='' onClick={() => handleViewCoverLetter(resume.id)}>
                    View Cover Letter
                  </Link>
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
                  {resume.matchPercent ? `${resume.matchPercent}%` : "N/A"}
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
