import { Link } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEnquiries } from '../../hooks/useEnquiries';
import { StatsCard } from '../../components/admin/StatsCard';
import { EnquiryStatusBadge } from '../../components/admin/EnquiryStatusBadge';
import type { EnquiryStatus } from '../../types/admin';

export function Dashboard() {
  const { user } = useAuthenticator((context) => [context.user]);
  const userEmail = user?.signInDetails?.loginId;
  const { enquiries, isLoading, stats, isAdmin } = useEnquiries({ userEmail });

  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'Admin Dashboard' : 'Your Quotes'}
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.signInDetails?.loginId?.split('@')[0] || 'User'}
          {!isAdmin && ' - You can view quotes associated with your email address.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Enquiries" value={stats.total} color="gray" />
        <StatsCard label="New" value={stats.new} color="blue" />
        <StatsCard label="In Review" value={stats.inReview} color="yellow" />
        <StatsCard label="Contacted" value={stats.contacted} color="purple" />
      </div>

      {/* Recent Enquiries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Enquiries</h2>
          <Link
            to="/account/enquiries"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : recentEnquiries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No enquiries yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentEnquiries.map((enquiry) => (
              <li key={enquiry.id}>
                <Link
                  to={`/account/enquiries/${enquiry.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{enquiry.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {enquiry.businessName || 'No business name'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <EnquiryStatusBadge status={(enquiry.status as EnquiryStatus) || 'new'} />
                      <span className="text-sm text-gray-400">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
