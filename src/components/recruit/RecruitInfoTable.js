import React from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useUser } from '../../context/UserContext';

export default function RecruitInfoTable() {
  const {
    recruiter
  } = useUser()
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
                    </>
                  )}
                  {recruit.address.appt && (
                    <>
                    {recruit.address.appt}
                    </>
                  )}
                  {recruit.address.city && (
                    <>
                    {recruit.address.city}
                    </>
                  )}
                  {recruit.address.state && (
                    <>
                    {recruit.address.state}
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
                  <td>Create</td>
                )}
                <td>More</td>
                <td>
                  <Button variant="secondary">Edit</Button>
                  <Button variant="danger">Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
    </>
  )
}
