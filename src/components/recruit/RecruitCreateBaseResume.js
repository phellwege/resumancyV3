import React from 'react'
import { Form } from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
export default function RecruitCreateBaseResume() {
    const {
        recruit,
        handleRecruitResumeChange,
    } = useUser()
  return (
    <>
        <Form>
            <h5>Resume Information</h5>
            <Form.Group>
                <Form.Label>Experience</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Experience"
                    value={recruit.resume.experience}
                    onChange={(e)=>{handleRecruitResumeChange('experience', e.target.value)}}
                ></Form.Control>
                <Form.Label>Education</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Education"
                    value={recruit.resume.education}
                    onChange={(e) => {handleRecruitResumeChange('education', e.target.value)}}
                ></Form.Control>
                <Form.Text>Education and Certifications</Form.Text>
                <Form.Label>Skills</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Skills"
                    value={recruit.resume.skills}
                    onChange={(e) => {handleRecruitResumeChange('skills', e.target.value)}}
                ></Form.Control>
                <Form.Label>Summary</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Summary"
                    value={recruit.resume.summary}
                    onChange={(e) => {handleRecruitResumeChange('summary', e.target.value)}}
                ></Form.Control>
                <Form.Text>Optional</Form.Text>
                <Form.Label>Additional Info</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Additional Info"
                    value={recruit.resume.additional}
                    onChange={(e)=> {handleRecruitResumeChange('additional', e.target.value)}}
                ></Form.Control>
                <Form.Text>Anything Additional information you would like to add</Form.Text>
            </Form.Group>
        </Form>
    </>
  )
}
