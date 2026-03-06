import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="glass-panel text-center animate-fade-in" style={{ padding: '3rem 2rem' }}>
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '4rem', 
        height: '4rem', 
        borderRadius: '50%', 
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        marginBottom: '1.5rem'
      }}>
        {Icon && <Icon style={{ color: 'var(--accent-color)', width: '2rem', height: '2rem' }} />}
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
