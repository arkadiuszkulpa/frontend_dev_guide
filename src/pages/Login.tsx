import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Layout } from '../components/Layout';

export function Login() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/account';

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [authStatus, navigate, from]);

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Account Login</h1>
        <Authenticator
          hideSignUp={false}
          components={{
            Header() {
              return null;
            },
            SignUp: {
              Footer() {
                return (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Create an account to view your quotes.
                  </p>
                );
              },
            },
          }}
        />
      </div>
    </Layout>
  );
}
