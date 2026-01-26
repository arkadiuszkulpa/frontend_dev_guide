import { STATUS_LABELS, STATUS_COLORS, type EnquiryStatus } from '../../types/admin';

interface EnquiryStatusBadgeProps {
  status: EnquiryStatus;
}

export function EnquiryStatusBadge({ status }: EnquiryStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
