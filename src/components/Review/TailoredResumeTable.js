import React, {useEffect, useState} from 'react'
import { Button, Card, Alert, Table, OverlayTrigger, Tooltip} from 'react-bootstrap';
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
  return (
    <>
    <ReviewResumeModal />
    <ReviewCoverLetterModal />
    <ReviewJobDescModal />
        <h5>Tailored Resume(s)</h5>
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
    </>
  )
}
