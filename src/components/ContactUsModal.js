import React from 'react'
import { useUser } from '../context/UserContext'
import Modal from 'react-bootstrap/Modal';
import '../views/main.css'

export default function ContactUsModal() {
    const {
        contactUsModal,
        handleCloseContactUsModal
    } = useUser()
  return (
    <>
        <Modal
            show={contactUsModal}
            onHide={handleCloseContactUsModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton closeVariant='white'>
                <Modal.Title>Contact Us</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='modalBodyWrap'>
                    <a href='mailto:Support@Resumancy.com'>Support@Resumancy.com</a>
                </div>
                <div className='modalBodyWrap'>
                    <p>Thank you for reaching out! We aim to respond to all inquiries within 48 hours. Your patience is appreciated.</p>
                </div>
            </Modal.Body>
        </Modal>
    </>
  )
}
