import React from 'react'
import { Button, Card, Alert, Table, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import ReviewBaseResumeModal from './ReviewBaseResumeModal';

export default function BaseResumeTable() {
    const {
        handleOpenReviewBaseResumeModal,
    } = useUser()
  return (
    <>
        <ReviewBaseResumeModal />
        <h5>Base Resume</h5>
        <Table striped bordered hover variant='dark'>
        <thead>
            <tr>
            <th>View</th>
            <th>Date</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td onClick={handleOpenReviewBaseResumeModal}>View</td>
            <td></td>
            </tr>
        </tbody>
        </Table>
    </>
  )
}
