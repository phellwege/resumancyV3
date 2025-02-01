import React from 'react'
import { useUser } from '../../context/UserContext'
import { Form } from 'react-bootstrap'

export default function EditCoverLetter() {
    const {
        user,
        setUser,
        selectedCoverLetterIdData
    } = useUser();

    const handleCoverLetterChange = (e) => {
        const coverLetterSummary = e.target.value;
        
        // Use setUser to update the user state
        setUser((prevState) => ({
          ...prevState,
          coverLetter: {
            ...prevState.coverLetter,
            response: coverLetterSummary,
          },
        }));
      };

  return (
    <>
    <div className='cardInnerDiv'>
        <Form>
            <Form.Group>
                <Form.Control 
                    as='textarea'
                    rows={25}
                    placeholder='Cover Letter'
                    value={selectedCoverLetterIdData.response}
                    onChange={handleCoverLetterChange}
                    maxLength='5000'
                />
            </Form.Group>
        </Form>
    </div>
    </>
  )
}
