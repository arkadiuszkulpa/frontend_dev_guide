import { useState } from 'react';
import { STATUS_LABELS, type EnquiryStatus } from '../../types/admin';

interface StatusDropdownProps {
  currentStatus: EnquiryStatus;
  onStatusChange: (status: EnquiryStatus) => Promise<void>;
}

const statuses: EnquiryStatus[] = [
  'new',
  'in_review',
  'contacted',
  'quoted',
  'accepted',
  'declined',
  'completed',
];

export function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as EnquiryStatus;
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="status" className="text-sm font-medium text-gray-700">
        Status:
      </label>
      <select
        id="status"
        value={currentStatus}
        onChange={handleChange}
        disabled={isUpdating}
        className="rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      {isUpdating && (
        <span className="text-sm text-gray-500">Saving...</span>
      )}
    </div>
  );
}
