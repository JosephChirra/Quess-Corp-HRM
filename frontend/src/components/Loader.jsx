import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', width: '100%' }}>
        <Loader2 className="animate-spin" style={{ color: 'var(--accent-color)', width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <Loader2 className="animate-spin" style={{ color: 'var(--accent-color)', width: '2rem', height: '2rem' }} />
    </div>
  );
};

export default Loader;
