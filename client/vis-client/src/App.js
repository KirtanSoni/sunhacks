import React, { useState } from 'react'
import Chart from './Chart'


const sampleMermaid = `
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`

export default function App() {
  const [sourceCode, setSourceCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  
  const appStyle = {
    backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
    color: darkMode ? '#ffffff' : '#000000',
    minHeight: '100vh',
    transition: 'all 0.3s ease',
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: isLoading ? '#cccccc' : '#452169',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://zhqs8d3n-8080.usw3.devtunnels.ms/generate_mermaid_chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         body: JSON.stringify({ 'code': sourceCode, 'daiagram': 'flowchart' }),
      });
      const data = await response.json();
      console.log(data.code.slice(10, -4))
      setMermaidCode(data.code.slice(10, -4));
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={appStyle}>
      <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}> 
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>CodeVis: Code to Mermaid Chart</h1>
        <button onClick={toggleDarkMode} style={{ ...buttonStyle, padding: '5px 10px' }}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
      </div>
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
        style={buttonStyle}
      >
        {isLoading ? 'Converting...' : 'Convert to Mermaid'}
      </button>
      {mermaidCode && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Generated Mermaid Chart</h2>
          <div className="mermaid">
            <Chart chartCode={mermaidCode} darkMode={darkMode}/>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}