import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import './i18n';
import App from './App';
import './index.css';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify - outputs will be generated after `npx ampx sandbox`
import outputs from '../amplify_outputs.json';

try {
  Amplify.configure(outputs);
} catch {
  console.log('Amplify not configured. Run `npx ampx sandbox` to generate config.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  </StrictMode>
);
