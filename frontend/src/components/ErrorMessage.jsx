import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid var(--danger-color)',
      color: 'var(--text-primary)',
      padding: '1rem',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem'
    }}>
      <AlertCircle style={{ color: 'var(--danger-color)' }} />
      <p style={{ margin: 0, fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
