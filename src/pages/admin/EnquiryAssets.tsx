import { useParams } from 'react-router-dom';
import { useEnquiry } from '../../hooks/useEnquiry';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useUserGroups } from '../../hooks/useUserGroups';
import { AssetUploadPage } from '../../components/assets';

export function EnquiryAssets() {
  const { id } = useParams<{ id: string }>();
  useAuthenticator((context) => [context.user]);
  const { groups } = useUserGroups();

  // Fetch basic enquiry info for the header
  const { enquiry, isLoading: isLoadingEnquiry } = useEnquiry(id || '', { userGroups: groups });

  if (!id) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Invalid enquiry ID</p>
      </div>
    );
  }

  const enquiryName = enquiry
    ? `${enquiry.fullName}${enquiry.businessName ? ` - ${enquiry.businessName}` : ''}`
    : undefined;

  return (
    <AssetUploadPage
      enquiryId={id}
      enquiryName={isLoadingEnquiry ? 'Loading...' : enquiryName}
    />
  );
}
