import { useState } from 'react';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  console.log('SearchBar rendered');

  // This causes a render on EVERY keystroke (performance issue!)
  const handleSearch = (value: string) => {
    setQuery(value);
    
    // Simulate expensive search operation
    const mockResults = [
      'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
      'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'
    ].filter(item => 
      item.toLowerCase().includes(value.toLowerCase())
    );
    
    setResults(mockResults);
  };

  return (
    <div style={{
      border: '2px solid #ffc107',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px',
      background: 'white'
    }}>
      <h2>Search Bar</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Type to search fruits..."
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '16px',
          marginBottom: '15px'
        }}
      />
      
      {query && (
        <div style={{
          background: '#fff9e6',
          padding: '10px',
          borderRadius: '4px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Results ({results.length}):
          </div>
          {results.map((result, idx) => (
            <div key={idx} style={{ padding: '5px 0' }}>
              {result}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '11px', color: '#999' }}>
        ⚠️ Re-renders on every keystroke (should use debouncing)
      </div>
    </div>
  );
}

export default SearchBar;