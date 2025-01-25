import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Alert, Table, OverlayTrigger, Tooltip} from 'react-bootstrap';
import ReviewResumeModal from './ReviewResumeModal';
import { useUser } from '../../context/UserContext';
import { useData } from '../../context/DataContext';

export default function BaseResumeTable() {
    const {
        handleOpenReviewResumeModal,
        user,
        setSelectedResumeId,
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
                (resume) => resume.usage?.baseResume === true
            );
            setResumes(filteredResumes);
        };

        loadResumes();
    }, []);

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
            {resumes.map((resume, index) => (
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
                            : 'NA'}
                    </td>
                </tr>
            ))}
        </tbody>
        </Table>
    </>
  )
}
