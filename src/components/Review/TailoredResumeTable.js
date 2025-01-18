import React from 'react'
import { Button, Card, Alert, Table, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import ReviewResumeModal from './ReviewResumeModal';
import ReviewCoverLetterModal from './ReviewCoverLetterModal'
export default function TailoredResumeTable() {
  const {
    user,
    handleOpenReviewTailoredResumeModal,
    handleOpenReviewCoverLetterModal
  } = useUser();
  return (
    <>
    <ReviewResumeModal />
    <ReviewCoverLetterModal />
        <h5>Tailored Resume(s)</h5>
        <Table striped bordered hover variant='dark'>
            <thead>
            <tr>
                <th>Company Name</th>
                <th>Job Description</th>
                <th>View</th>
                <th>Cover Letter</th>
                <th>Date</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{user.tailoredResume.companyName}</td>
                <td>{user.tailoredResume.description}</td>
                <td onClick={handleOpenReviewTailoredResumeModal}>View</td>
                <td onClick={handleOpenReviewCoverLetterModal}>Cover Letter</td>
                <td></td>
            </tr>
            </tbody>
        </Table>
    </>
  )
}
