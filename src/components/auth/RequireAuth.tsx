import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const location = useLocation();

  if (authStatus === 'configuring') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
