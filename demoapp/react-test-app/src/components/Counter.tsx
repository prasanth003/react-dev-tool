import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [clicks, setClicks] = useState(0);

  console.log('Counter rendered');

  // This is intentionally inefficient - calculates on every render
  const expensiveCalculation = () => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return result;
  };

  const handleIncrement = () => {
    setCount(count + 1);
    setClicks(clicks + 1); // Two state updates = two renders!
  };

  return (
    <div style={{
      border: '2px solid #667eea',
      borderRadius: '8px',
      padding: '20px',
      background: 'white'
    }}>
      <h3>Counter Component</h3>
      <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '20px 0' }}>
        {count}
      </div>
      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
        Total clicks: {clicks}
      </div>
      <div style={{ marginBottom: '15px', fontSize: '12px', color: '#999' }}>
        Expensive calc: {expensiveCalculation().toLocaleString()}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleIncrement}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Increment
        </button>
        <button 
          onClick={() => setCount(count - 1)}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          - Decrement
        </button>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11px', color: '#999' }}>
        ⚠️ Has performance issues (expensive calculation on every render)
      </div>
    </div>
  );
}

export default Counter;