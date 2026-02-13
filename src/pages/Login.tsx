import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/Layout';

export function Login() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('form');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/account';

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [authStatus, navigate, from]);

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t('login.backToHome')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('login.title')}</h1>
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
                    {t('login.signUpFooter')}
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
