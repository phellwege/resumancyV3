import React from 'react'
import { Button, Card, Alert, Table, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { Link } from "react-router-dom";

import { useUser } from '../../context/UserContext';
import ReviewResumeModal from './ReviewResumeModal';
import ReviewCoverLetterModal from './ReviewCoverLetterModal'
import ReviewJobDescModal from './ReviewJobDescModal';
export default function TailoredResumeTable() {
  const {
    user,
    handleOpenReviewResumeModal,
    handleOpenReviewCoverLetterModal,
    handleOpenReviewJobDescModal
  } = useUser();
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
            <tr>
                <td>{user.tailoredResume.companyName}</td>
                <td>
                  <Link to='' onClick={handleOpenReviewJobDescModal}>
                    View Job Description
                  </Link>
                </td>
                <td>
                  <Link to='' onClick={handleOpenReviewResumeModal}>
                    View Tailored Resume
                  </Link>
                </td>
                <td>
                  <Link to='' onClick={handleOpenReviewCoverLetterModal}>
                    View Cover Letter
                  </Link>
                </td>
                <td></td>
            </tr>
            </tbody>
        </Table>
    </>
  )
}
