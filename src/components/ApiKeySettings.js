// Replaces the old Firebase login modal: the visitor brings their own OpenAI
// key and picks a model. The key is used only for calls to api.openai.com.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { MODEL_OPTIONS, DEFAULT_MODEL } from '../lib/openai';
import Logo from '../static/logo_monochrome.webp';
import '../views/main.css';

const CUSTOM = '__custom__';

export default function ApiKeySettings() {
    const navigate = useNavigate();
    const { apiKey, model, rememberKey, saveSettings, forgetKey } = useAuth();
    // The old login modal state now drives this settings modal.
    const { user, startProfile, setSuccessMessage, loginModal: settingsOpen, handleCloseLoginModal: closeSettings } = useUser();

    const [keyInput, setKeyInput] = useState(apiKey);
    const [showKey, setShowKey] = useState(false);
    const [remember, setRemember] = useState(rememberKey);
    const isKnown = MODEL_OPTIONS.some((m) => m.id === model);
    const [modelChoice, setModelChoice] = useState(isKnown ? model : CUSTOM);
    const [customModel, setCustomModel] = useState(isKnown ? '' : model);
    const [test, setTest] = useState(null); // { ok, message }
    const [testing, setTesting] = useState(false);

    // Refill the form from saved settings each time it opens.
    useEffect(() => {
        if (!settingsOpen) return;
        const known = MODEL_OPTIONS.some((m) => m.id === model);
        setKeyInput(apiKey);
        setRemember(rememberKey);
        setModelChoice(known ? model : CUSTOM);
        setCustomModel(known ? '' : model);
        setTest(null);
        setShowKey(false);
    }, [settingsOpen, apiKey, model, rememberKey]);

    const chosenModel = (modelChoice === CUSTOM ? customModel : modelChoice).trim() || DEFAULT_MODEL;

    const testKey = async () => {
        setTesting(true);
        setTest(null);
        try {
            const res = await fetch(`https://api.openai.com/v1/models/${encodeURIComponent(chosenModel)}`, {
                headers: { Authorization: `Bearer ${keyInput.trim()}` },
            });
            if (res.ok) setTest({ ok: true, message: `Key works and can use ${chosenModel}.` });
            else if (res.status === 401) setTest({ ok: false, message: 'OpenAI rejected this key.' });
            else if (res.status === 404) setTest({ ok: false, message: `The key works, but ${chosenModel} is not available to it.` });
            else setTest({ ok: false, message: `OpenAI answered with status ${res.status}.` });
        } catch {
            setTest({ ok: false, message: 'No usable reply from api.openai.com. Check the key and your connection.' });
        }
        setTesting(false);
    };

    const handleSave = () => {
        saveSettings({ apiKey: keyInput, model: chosenModel, remember });
        closeSettings();
        if (!user.id) {
            startProfile();
            navigate('/InitialUserSetup');
        } else {
            setSuccessMessage('✅ Settings saved.');
        }
    };

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
                <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <Form.Group className="mb-3" controlId="apiKey">
                        <Form.Label>OpenAI API key</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showKey ? 'text' : 'password'}
                                placeholder="sk-..."
                                autoComplete="off"
                                spellCheck={false}
                                value={keyInput}
                                onChange={(e) => { setKeyInput(e.target.value); setTest(null); }}
                            />
                            <Button variant="secondary" onClick={() => setShowKey((s) => !s)}>
                                {showKey ? 'Hide' : 'Show'}
                            </Button>
                        </InputGroup>
                        <Form.Text>
                            Create one at{' '}
                            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                                platform.openai.com/api-keys
                            </a>. A key with a low spending limit is a good idea for demos.
                        </Form.Text>
                    </Form.Group>
                    <Form.Check
                        className="mb-3"
                        id="rememberKey"
                        type="checkbox"
                        label="Remember the key on this device (stored in this browser's localStorage). Leave off to keep it in memory only until you close the tab."
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <Form.Group className="mb-3" controlId="model">
                        <Form.Label>Model</Form.Label>
                        <Form.Select value={modelChoice} onChange={(e) => { setModelChoice(e.target.value); setTest(null); }}>
                            {MODEL_OPTIONS.map((m) => (
                                <option key={m.id} value={m.id}>{m.label}</option>
                            ))}
                            <option value={CUSTOM}>Other (type a model id)</option>
                        </Form.Select>
                        {modelChoice === CUSTOM && (
                            <Form.Control
                                className="mt-2"
                                placeholder="e.g. gpt-4.1-nano"
                                value={customModel}
                                onChange={(e) => { setCustomModel(e.target.value); setTest(null); }}
                            />
                        )}
                    </Form.Group>
                    {test && (
                        <Alert variant={test.ok ? 'success' : 'warning'} className="py-2">{test.message}</Alert>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {apiKey && (
                    <Button variant="outline-danger" className="me-auto" onClick={() => { forgetKey(); setKeyInput(''); }}>
                        Forget key
                    </Button>
                )}
                <Button variant="secondary" onClick={testKey} disabled={!keyInput.trim() || testing}>
                    {testing ? 'Testing...' : 'Test key'}
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={!keyInput.trim()}>
                    {user.id ? 'Save' : 'Save and start'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
