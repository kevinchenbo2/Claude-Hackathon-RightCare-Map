function UrgencyBadge({ urgencyLevel, urgencyColor }) {
  // Using exact hex colors from design spec for consistency
  // green: #10B981, yellow: #F59E0B, red: #EF4444
  const colorStyles = {
    green: {
      backgroundColor: '#10B981',
      boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
    },
    yellow: {
      backgroundColor: '#F59E0B',
      boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)'
    },
    red: {
      backgroundColor: '#EF4444',
      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
    },
  };

  const formatUrgencyLevel = (level) => {
    if (!level) return '';
    return level
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const style = colorStyles[urgencyColor] || { backgroundColor: '#6B7280' };

  return (
    <div
      className="inline-block px-6 py-3 rounded-full text-white font-bold text-lg transform transition-all duration-300 hover:scale-105"
      style={style}
    >
      {formatUrgencyLevel(urgencyLevel)}
    </div>
  );
}

export default UrgencyBadge;
