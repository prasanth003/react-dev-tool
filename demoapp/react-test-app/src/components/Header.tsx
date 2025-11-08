import { useState } from 'react';

interface HeaderProps {
  title: string;
  count: number;
}

function Header({ title, count }: HeaderProps) {
  const [notifications, setNotifications] = useState(0);

  console.log('Header rendered');

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>{title}</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>Timer: {count}s</div>
          <button 
            onClick={() => setNotifications(n => n + 1)}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔔 Notifications ({notifications})
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;