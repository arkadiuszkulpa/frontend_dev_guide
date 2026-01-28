import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Layout } from '../components/Layout';

export function Login() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [authStatus, navigate, from]);

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Admin Login</h1>
        <Authenticator
          hideSignUp={false} // TODO: Set to true for production
          components={{
            Header() {
              return null;
            },
          }}
        />
      </div>
    </Layout>
  );
}
