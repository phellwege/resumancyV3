import React from 'react'
import { useUser } from '../../context/UserContext'
import { Form } from 'react-bootstrap'

export default function EditCoverLetter() {
    const {
        setUser,
        selectedCoverLetterIdData
    } = useUser();

    const handleCoverLetterChange = (e) => {
      const coverLetterSummary = e.target.value;
  
      setUser((prevState) => ({
          ...prevState,
          coverLetter: prevState.coverLetter.map((cl) =>
              cl.id === selectedCoverLetterIdData.id
                  ? { ...cl, response: coverLetterSummary }
                  : cl
          ),
      }));
  };

  return (
    <>
      <Form>
          <Form.Group>
              <Form.Control 
                  as='textarea'
                  rows={20}
                  placeholder='Cover Letter'
                  value={selectedCoverLetterIdData.response}
                  onChange={handleCoverLetterChange}
                  maxLength='5000'
              />
          </Form.Group>
      </Form>
    </>
  )
}
