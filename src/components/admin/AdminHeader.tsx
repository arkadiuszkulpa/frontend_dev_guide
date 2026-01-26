import { useAuthenticator } from '@aws-amplify/ui-react';

export function AdminHeader() {
  const { user, signOut } = useAuthenticator((context) => [context.user, context.signOut]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.signInDetails?.loginId}</span>
          <button
            onClick={signOut}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
