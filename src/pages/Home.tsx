import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/Layout';

export function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation('form');

  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
          {t('home.subtitle')}
        </p>
        <button
          onClick={() => navigate('/enquiry')}
          className="inline-flex items-center px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25"
        >
          {t('home.startButton')}
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
        <p className="mt-8 text-gray-500">
          {t('home.timeEstimate')}
        </p>

        {/* Login section */}
        <div className="mt-16 pt-8 border-t border-gray-200 max-w-md mx-auto">
          <p className="text-gray-600 mb-4">
            {t('home.loginSection.text')}
          </p>
          <Link
            to="/account"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg border border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <svg
              className="mr-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {t('home.loginSection.button')}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
