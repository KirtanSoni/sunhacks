import React, { useState } from 'react'
import Chart from './Chart'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';


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
      const response = await fetch('http://localhost:8080/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         body: JSON.stringify({ 'code': sourceCode, 'diagram': 'flowchart topdown' }),
      });
      const data = await response.json();
      console.log(data.code)
      setMermaidCode(data.code);
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
            {darkMode ? '☀️' : '🌙'}
          </button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <CodeMirror
            value={sourceCode}
            height="200px"
            theme={darkMode ? dracula : 'light'}
            extensions={[javascript({ jsx: true })]}
            onChange={(value) => setSourceCode(value)}
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