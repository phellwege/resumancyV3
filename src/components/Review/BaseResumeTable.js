import React from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Alert, Table, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import ReviewResumeModal from './ReviewResumeModal';

export default function BaseResumeTable() {
    const {
        handleOpenReviewResumeModal,
        user
    } = useUser()
  return (
    <>
        <ReviewResumeModal />
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
                <td>
                    <Link to='' onClick={handleOpenReviewResumeModal}>
                    View
                    </Link>
                </td>
                <td> 
                    {user.resume.usage.timeStamp ? 
                    (
                        <>
                        {new Intl.DateTimeFormat("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                        }).format(new Date(user.resume.usage.timeStamp))}
                        </>
                    ) 
                    : 
                    (
                        <>
                        NA
                        </>
                    )
                    }
                </td>
            </tr>
        </tbody>
        </Table>
    </>
  )
}
