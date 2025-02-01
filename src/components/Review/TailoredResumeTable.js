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
    setSelectedTailoredResumeId
  } = useUser();
  const {
      fetchResumes
  } = useData();

      const [resumes, setResumes] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 10;
  
      useEffect(() => {
          const loadResumes = async () => {
              const userId = user.id;
              const fetchedResumes = await fetchResumes(userId);
              const filteredResumes = fetchedResumes.filter(
                  (resume) => resume.usage?.baseResume === false
              );
              setResumes(filteredResumes);
          };
  
          loadResumes();
      }, []);

      const handleViewResume = (resumeId) => {
          setSelectedResumeId(resumeId);
          handleOpenReviewResumeModal();
      };
      const handleViewCoverLetter = (resumeId) => {
        setSelectedTailoredResumeId(resumeId);
        handleOpenReviewCoverLetterModal();
      };
      const handleViewJobDesc = (resumeId) => {
        setSelectedTailoredResumeId(resumeId);
        handleOpenReviewJobDescModal();
    };

  // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = resumes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(resumes.length / itemsPerPage);
  return (
    <>
    <ReviewResumeModal />
    <ReviewCoverLetterModal />
    <ReviewJobDescModal />

        <h5>Tailored Resume(s)</h5>
        {resumes.length > 0 && (
          <p className="text-muted">
            Showing {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, resumes.length)} of {resumes.length} records
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
            </tr>
            </thead>
            <tbody>
            {user.tailoredResume.slice(1).map((resume) => (
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
                  {resume.createdAt
                    ? new Intl.DateTimeFormat("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(resume.createdAt))
                    : "NA"
                  }
                </td>
              </tr>
            ))}
            </tbody>
        </Table>

        {resumes.length > itemsPerPage && (
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
  )
}
