import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import PlatformComparison from '../PlatformComparison';

// Replaces the old pricing card: this build is free and bring-your-own-key.
export default function CurrentPlans() {
  const { user, handleOpenLoginModal } = useUser();
  const { hasApiKey, model } = useAuth();

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="cardInnerDiv p-3">
          <h4 className="mb-3">Free demo, bring your own key</h4>
          <p className="alignLeft">
            Resumancy runs entirely in your browser. Paste your own OpenAI API key, pick a model, and every
            request goes straight from your browser to OpenAI. There is no account, no server and no database:
            your profile and resumes are saved only in this browser, and you can export or delete them any time.
          </p>
          <p className="alignLeft mb-3">
            <strong>Current model:</strong> {hasApiKey ? model : 'no key added yet'}
          </p>
          <div className="text-center">
            <Button variant="primary" onClick={handleOpenLoginModal}>
              {hasApiKey ? 'Change key or model' : user?.id ? 'Add your API key' : 'Get started'}
            </Button>
          </div>
          {!user?.id && <PlatformComparison />}
        </div>
      </Card.Body>
    </Card>
  );
}
