import React from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useUser } from '../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

export default function RecruitInfoTable() {
  const {
    recruiter,
    recruitAction, setRecruitAction,
    setAddingRecruit,
    setRecruitCreateBaseResume,
    setRecruitCreateTailoredResume,
    setEditingRecruit,
    setViewingRecruitDetails,
  } = useUser()
  const history = useNavigate();
  return (
    <>
        <Table striped bordered hover variant='dark'>
          <thead>
            <tr>
              <th>Date Added</th>
              <th>Job Title</th>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Address</th>
              <th>Base Resume</th>
              <th>More</th>
              <th>Edit / Remove</th>
            </tr>
          </thead>
          <tbody>
            {recruiter.recruits.map(recruit => (
              <tr key={recruit.id}>
                <td>{recruit.timeStamp}</td>
                <td>{recruit.jobTitle}</td>
                <td>{recruit.firstName}{' '}{recruit.lastName}</td>
                <td>
                  <a href={`tel:${recruit.contactInfo.phone.replace(/\D/g, '')}`}>
                    {recruit.contactInfo.phone}
                  </a>
                  <br/>
                  <a href={`mailto:${recruit.contactInfo.email}`}>
                    {recruit.contactInfo.email}
                  </a>
                  <br/>
                  {recruit.contactInfo.socialMedia}
                </td>
                <td>
                  {/* optional */}
                  {recruit.address.street && (
                    <>
                    {recruit.address.street}
                    <br/>
                    </>
                  )}
                  {recruit.address.appt && (
                    <>
                    {recruit.address.appt}
                    <br/>
                    </>
                  )}
                  {recruit.address.city && (
                    <>
                    {recruit.address.city}
                    {', '}
                    </>
                  )}
                  {recruit.address.state && (
                    <>
                    {recruit.address.state}
                    <br/>
                    </>
                  )}
                  {recruit.address.zip && (
                    <>
                    {recruit.address.zip}
                    </>
                  )}
                </td>
                {recruit.resume.timeStamp ? (
                  <td>View</td>
                ) : (
                  <td>
                    <a onClick={() => {
                      setRecruitCreateBaseResume(recruit.id);
                      history(`/RecruitCreateResume/${recruit.id}`)
                    }}>
                      <Link>Create</Link>
                    </a>
                  </td>
                )}
                <td>
                  <a onClick={() => {
                    setViewingRecruitDetails(recruit.id);
                    history(`/Recruit/${recruit.id}`)
                    }}
                  >
                    <Link>More</Link>
                  </a>
                </td>
                <td>
                  <Button 
                  variant="secondary" 
                  onClick={() => {
                    setEditingRecruit(recruit.id); 
                    history(`/Recruit/${recruit.id}`)
                  }}
                  >
                    Edit
                  </Button>
                  <br/>
                  <Button variant="danger">Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
    </>
  )
}
