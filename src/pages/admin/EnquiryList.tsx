import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEnquiries } from '../../hooks/useEnquiries';
import { useUserGroups } from '../../hooks/useUserGroups';
import { EnquiryStatusBadge } from '../../components/admin/EnquiryStatusBadge';
import { STATUS_LABELS, type EnquiryStatus } from '../../types/admin';

const statusFilters: Array<{ value: EnquiryStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'completed', label: 'Completed' },
];

export function EnquiryList() {
  const { user } = useAuthenticator((context) => [context.user]);
  const { groups, isLoading: groupsLoading } = useUserGroups();
  const userEmail = user?.signInDetails?.loginId;
  const [activeFilter, setActiveFilter] = useState<EnquiryStatus | 'all'>('all');
  const { enquiries, isLoading, error, isAdmin } = useEnquiries({
    statusFilter: activeFilter,
    userGroups: groups,
    userEmail,
    groupsLoading,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'All Enquiries' : 'Your Enquiries'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isAdmin
            ? 'Manage all website enquiries'
            : 'View enquiries submitted with your email address'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading enquiries...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error.message}</div>
        ) : enquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No enquiries found
            {activeFilter !== 'all' && ` with status "${STATUS_LABELS[activeFilter]}"`}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{enquiry.fullName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {enquiry.businessName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {enquiry.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EnquiryStatusBadge status={(enquiry.status as EnquiryStatus) || 'new'} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        to={`/account/enquiries/${enquiry.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
