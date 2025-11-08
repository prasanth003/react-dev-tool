import { useState } from 'react';

interface UserProfileProps {
  user: {
    id: number;
    name: string;
    age: number;
  };
}

function UserProfile({ user }: UserProfileProps) {
  const [expanded, setExpanded] = useState(false);

  console.log('UserProfile rendered:', user.name);

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      background: 'white'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{user.name}</h3>
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        Age: {user.age}
      </div>
      <button 
        onClick={() => setExpanded(!expanded)}
        style={{
          background: '#667eea',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {expanded ? 'Show Less' : 'Show More'}
      </button>
      
      {expanded && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <div>ID: {user.id}</div>
          <div>Status: Active</div>
          <div>Joined: 2024</div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;