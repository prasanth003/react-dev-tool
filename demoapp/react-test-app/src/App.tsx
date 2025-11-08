import { useState, useEffect } from 'react';
import Header from './components/Header';
import Counter from './components/Counter';
import TodoList from './components/TodoList';
import SearchBar from './components/SearchBar';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const [globalCount, setGlobalCount] = useState(0);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Bob Johnson', age: 35 },
  ]);

  // This causes re-renders every second (performance issue!)
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <Header title="React Performance Test App" count={globalCount} />
      
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '8px'
        }}>
          <h3>Global Timer: {globalCount}s</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            This causes the Header to re-render every second (performance issue!!!)
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <Counter />
          <Counter />
        </div>

        <SearchBar />
        
        <TodoList />

        <div style={{ marginTop: '20px' }}>
          <h2>User Profiles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            {users.map(user => (
              <UserProfile key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;