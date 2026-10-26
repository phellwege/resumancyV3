// Settings modal (opened from the header, nav and "add your key" prompts).
// The form itself lives in ApiKeyForm, which the home page card also shows inline.
import React from 'react';
import { Alert, Modal } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import ApiKeyForm from './ApiKeyForm';
import Logo from '../static/logo_monochrome.webp';
import '../views/main.css';

export default function ApiKeySettings() {
    // The old login modal state now drives this settings modal.
    const { loginModal: settingsOpen, handleCloseLoginModal: closeSettings } = useUser();

    return (
        <Modal show={settingsOpen} onHide={closeSettings} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <img src={Logo} alt="" style={{ width: 32, marginRight: 8 }} />
                    Your OpenAI key and model
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="secondary" className="mb-3" style={{ fontSize: '0.9rem' }}>
                    This demo has no server. Your key stays in your browser and is sent only to
                    {' '}<code>api.openai.com</code>. Your resumes are saved only in this browser.
                    Usage is billed to your own OpenAI account.
                </Alert>
                <ApiKeyForm idPrefix="modal" refreshKey={settingsOpen} onSaved={closeSettings} />
            </Modal.Body>
        </Modal>
    );
}
