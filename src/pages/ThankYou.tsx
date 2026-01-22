import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

export function ThankYou() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Thank you!
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          We've received your enquiry and will be in touch soon to discuss your project.
        </p>
        <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">What happens next?</h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">1.</span>
              We'll review your requirements
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">2.</span>
              We'll reach out within 24-48 hours
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">3.</span>
              We'll discuss options that match your needs
            </li>
          </ul>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-primary-500 hover:text-primary-600 font-medium"
        >
          &larr; Back to home
        </button>
      </div>
    </Layout>
  );
}
