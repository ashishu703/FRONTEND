export const mapSalesStatusToBucket = (salesStatus) => {
  const status = (salesStatus || '').toLowerCase();
  switch (status) {
    case 'running':
      return 'connected';
    case 'interested':
      return 'connected';
    case 'converted':
    case 'win_converted':
      return 'converted';
    case 'next_meeting':
      return 'next-meeting';
    case 'lost_closed':
    case 'closed':
      return 'closed';
    case 'pending':
    default:
      return 'not-connected';
  }
};

export const formatStatusLabel = (salesStatus) => {
  const status = (salesStatus || '').toLowerCase();
  if (status === 'win_converted') return 'Converted';
  if (status === 'lost_closed') return 'Closed';
  if (status === 'next_meeting') return 'Next Meeting';
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

