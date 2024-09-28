import React, { useState } from 'react';
import mermaid from 'mermaid';

export default function App() {
  const [sourceCode, setSourceCode] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Add backend 
      const response = await fetch('http://your-backend-url/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceCode }),
      });
      const data = await response.json();
      setMermaidCode(data.mermaidCode);
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>CodeVis: Code to Mermaid Chart</h1>
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          placeholder="Paste your code here..."
          style={{ width: '100%', height: '200px', padding: '10px' }}
        />
      </div>
      <button 
        onClick={handleSubmit} 
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: isLoading ? '#cccccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Converting...' : 'Convert to Mermaid'}
      </button>
      {mermaidCode && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Generated Mermaid Chart</h2>
          <div className="mermaid">{mermaidCode}</div>
        </div>
      )}
    </div>
  );
}