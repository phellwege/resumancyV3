import React from 'react'
import { Link } from 'react-router-dom';
import {Table} from 'react-bootstrap';
import ReviewResumeModal from './ReviewResumeModal';
import { useUser } from '../../context/UserContext';
import { useData } from '../../context/DataContext';

export default function BaseResumeTable() {
    const {
        handleOpenReviewResumeModal,
        setSelectedResumeId,
    } = useUser();
    const {
        readyBaseResume
    } = useData();

    const handleViewResume = (resumeId) => {
        setSelectedResumeId(resumeId);
        handleOpenReviewResumeModal();
    };

  return (
    <>
        <ReviewResumeModal/>
        <h5>Base Resume</h5>
        <Table striped bordered hover variant='dark'>
        <thead>
            <tr>
            <th>View</th>
            <th>Date</th>
            </tr>
        </thead>
        <tbody>
            {readyBaseResume.map((resume, index) => (
                <tr key={index}>
                    <td>
                        <Link to='' onClick={() => handleViewResume(resume.id)}>
                            View
                        </Link>
                    </td>
                    <td>
                        {resume.usage?.timeStamp
                            ? new Intl.DateTimeFormat('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }).format(new Date(resume.usage.timeStamp))
                            : 'NA'
                        }
                    </td>
                </tr>
            ))}
        </tbody>
        </Table>
    </>
  )
}
