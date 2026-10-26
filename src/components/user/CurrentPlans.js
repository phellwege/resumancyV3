import React from 'react';
import { Card } from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import ApiKeyForm from '../ApiKeyForm';
import PlatformComparison from '../PlatformComparison';

// Home page card: the bring-your-own-key setup, inline. New visitors start
// here (Save and start); returning visitors can change key or model.
export default function CurrentPlans() {
  const { user } = useUser();

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="cardInnerDiv p-3">
          <h4 className="mb-3">{user?.id ? 'Your OpenAI key and model' : 'Get started: bring your own key'}</h4>
          <p className="alignLeft">
            Resumancy runs entirely in your browser. Paste your own OpenAI API key, pick a model, and every
            request goes straight from your browser to OpenAI. There is no account, no server and no database:
            your profile and resumes are saved only in this browser, and you can export or delete them any time.
            Usage is billed to your own OpenAI account.
          </p>
          <ApiKeyForm idPrefix="home" />
          {!user?.id && <PlatformComparison />}
        </div>
      </Card.Body>
    </Card>
  );
}
