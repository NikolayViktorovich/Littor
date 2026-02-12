export const formatTime = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now - messageDate;
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatMessageTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const formatDateGroup = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatCallDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-GB');
};
