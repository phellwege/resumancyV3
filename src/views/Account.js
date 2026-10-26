import React, { useRef } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import DeleteUserModal from '../components/user/DeleteUserModal';

// Data & Settings: everything the visitor has is in this browser, so this
// page lets them see, export, import and delete it.
export default function Account() {
  const { user, setUser, initialUserState, setDeleteAcctModal, setSuccessMessage, setError, handleOpenLoginModal } = useUser();
  const { hasApiKey, rememberKey, model } = useAuth();
  const fileInput = useRef(null);

  const baseCount = user.resume.filter((r) => r.id && r.usage?.baseResume).length;
  const tailoredCount = user.resume.filter((r) => r.id && !r.usage?.baseResume).length;
  const letterCount = user.coverLetter.filter((c) => c.id).length;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ app: 'resumancy', version: 3, data: user }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumancy-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed?.app !== 'resumancy' || !parsed.data?.id) throw new Error('bad file');
      setUser({ ...initialUserState, ...parsed.data, avatarImg: initialUserState.avatarImg });
      setSuccessMessage('✅ Data imported into this browser.');
    } catch {
      setError('That file is not a Resumancy export.');
    }
  };

  return (
    <>
      <Header />
      <div className='pageWrapper'>
        <div className='secondaryPageWrapper'>
          <DeleteUserModal />
          <div className='rightDiv'>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <div className="cardInnerDiv p-3">
                  <h4 className="mb-3">OpenAI key and model</h4>
                  <p className="mb-1"><strong>Key:</strong> {hasApiKey ? (rememberKey ? 'saved on this device' : 'in memory for this tab only') : 'not added'}</p>
                  <p className="mb-3"><strong>Model:</strong> {model}</p>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Your key is sent only to api.openai.com, straight from this browser. Usage is billed to your own OpenAI account.
                  </p>
                  <Button onClick={handleOpenLoginModal}>Change key or model</Button>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className='leftDiv'>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <div className="cardInnerDiv p-3">
                  <h4 className="mb-3">Your data (this browser only)</h4>
                  <p className="mb-1"><strong>Base resumes:</strong> {baseCount}</p>
                  <p className="mb-1"><strong>Tailored resumes:</strong> {tailoredCount}</p>
                  <p className="mb-3"><strong>Cover letters:</strong> {letterCount}</p>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Nothing is stored on a server. Clearing your browser data removes it, so export a copy if you want to keep it.
                  </p>
                  <div className="d-flex gap-2 flex-wrap justify-content-center">
                    <Button variant="secondary" onClick={handleExport}>Export as JSON</Button>
                    <Button variant="secondary" onClick={() => fileInput.current?.click()}>Import JSON</Button>
                    <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={handleImport} />
                    <Button variant="danger" onClick={() => setDeleteAcctModal(true)}>Delete my data</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
