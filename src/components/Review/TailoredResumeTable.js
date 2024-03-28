import React from 'react'
import { Button, Card, Alert, Table, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import ReviewTailoredResumeResumeModal from './ReviewTailoredResumeModal';
import ReviewCoverLetterModal from './ReviewCoverLetterModal'
export default function TailoredResumeTable() {
  const {
    handleOpenReviewTailoredResumeModal,
    handleOpenReviewCoverLetterModal
  } = useUser();
  return (
    <>
    <ReviewTailoredResumeResumeModal />
    <ReviewCoverLetterModal />
        <h5>Tailored Resume</h5>
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
                <td></td>
                <td></td>
                <td onClick={handleOpenReviewTailoredResumeModal}>View</td>
                <td onClick={handleOpenReviewCoverLetterModal}>Cover Letter</td>
                <td></td>
            </tr>
            </tbody>
        </Table>
    </>
  )
}
