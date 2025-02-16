import React from 'react'
import { Link } from 'react-router-dom';
import { Table, OverlayTrigger, Tooltip, Pagination} from 'react-bootstrap';
import ReviewResumeModal from './ReviewResumeModal';
import { useUser } from '../../context/UserContext';
import { useData } from '../../context/DataContext';
import { BsQuestionCircle } from "react-icons/bs";

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
    const dateDesc = "The date this base resume was created.";
    const resumeDesc = "Your base resume, enhanced and used as a building block for all other resumes.";
    const resumeHoverDesc = "Click to view your base resume, enhanced and used as a building block for all other resumes.";

  return (
    <>
        <ReviewResumeModal/>
        <h5>Base Resume</h5>
        <Table striped bordered hover variant='dark'>
        <thead>
            <tr>
            <th>
                Resume
                <OverlayTrigger 
                    overlay={
                    <Tooltip id="tooltip">
                        {resumeDesc}
                    </Tooltip>
                    }>
                    <span className="question-icon">
                        <BsQuestionCircle />
                    </span>
                </OverlayTrigger>
            </th>
            <th>
                Date
                <OverlayTrigger 
                    overlay={
                    <Tooltip id="tooltip">
                        {dateDesc}
                    </Tooltip>
                    }>
                    <span className="question-icon">
                        <BsQuestionCircle />
                    </span>
                </OverlayTrigger>
            </th>
            </tr>
        </thead>
        <tbody>
            {readyBaseResume.map((resume, index) => (
                <tr key={index}>
                    <td>
                        <OverlayTrigger
                        overlay={
                            <Tooltip id="tooltip">
                            {resumeHoverDesc}
                            </Tooltip>
                        }
                        >
                        <Link to='' className='tailoredResumeMatch' onClick={() => handleViewResume(resume.id)}>
                            Base Resume
                        </Link>
                        </OverlayTrigger>
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
