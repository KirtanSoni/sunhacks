import React from 'react'

export default function AppHeader({ headImg, darkMode, toggleDarkMode }) {
  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    marginBottom: '20px',
  }

  const logoStyle = {
    width: '80px',
    height: 'auto',
    marginBottom: '10px',
  }

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
  }

  const taglineStyle = {
    fontSize: '16px',
    margin: '5px 0 0',
  }

  const toggleButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  }

  return (
    <header style={headerStyle}>
      <img src={headImg} alt="CodeVis Logo" style={logoStyle} />
      <h1 style={titleStyle}>CodeVis</h1>
      <p style={taglineStyle}>Code to Mermaid Chart</p>
      <button onClick={toggleDarkMode} style={toggleButtonStyle}>
        {darkMode ? '☀️' : '🌙'}
      </button>
    </header>
  )
}