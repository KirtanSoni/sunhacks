import React, { useEffect, useState, useCallback } from 'react'
import mermaid from 'mermaid'
import { Alert } from './Alert'
import { Tooltip } from './Tooltip'

export default function Chart({ chartCode, darkMode }) {
  const [svgSource, setSvgSource] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [svgContent, setSvgContent] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: darkMode ? 'dark' : 'default',
      securityLevel: 'loose',
    })
    
    if (chartCode) {
      setIsLoading(true)
      mermaid.render('mermaid-chart', chartCode)
        .then((result) => {
          const svgBlob = new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' })
          const url = URL.createObjectURL(svgBlob)
          setSvgContent(result.svg)
          setSvgSource(url)
          setError(null)
        })
        .catch((err) => {
          console.error('Mermaid rendering error:', err)
          setError('Failed to render chart. Please check your Mermaid syntax.')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    return () => {
      if (svgSource) {
        URL.revokeObjectURL(svgSource)
      }
    }
  }, [chartCode, darkMode])

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(chartCode).then(() => {
      setAlertMessage('Mermaid code copied to clipboard!')
      setShowAlert(true)
    }).catch(err => {
      console.error('Failed to copy code: ', err)
      setAlertMessage('Failed to copy code. Please try again.')
      setShowAlert(true)
    })
  }, [chartCode])

  const handleDownload = useCallback(() => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mermaid-chart.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setAlertMessage('SVG downloaded successfully!')
    setShowAlert(true)
  }, [svgContent])

  const hideAlert = useCallback(() => {
    setShowAlert(false)
  }, [])

  const handleZoomIn = () => setScale(prevScale => Math.min(prevScale * 1.2, 5))
  const handleZoomOut = () => setScale(prevScale => Math.max(prevScale / 1.2, 0.5))
  const handleResetZoom = () => setScale(1)

  if (isLoading) {
    return <div>Loading chart...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>
  }

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '2em',
    margin: '0 5px',
  }

  return svgSource ? (
    <>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Generated Mermaid Chart</h2>
      <div>
        <button style={buttonStyle} onClick={handleZoomIn}>🔍+</button>
        <button style={buttonStyle} onClick={handleZoomOut}>🔍-</button>
        <button style={buttonStyle} onClick={handleResetZoom}>↩️</button>
        <Tooltip text="Download SVG">
          <button style={buttonStyle} onClick={handleDownload}>⬇️</button>
        </Tooltip>
        <Tooltip text="Copy Code to Clipboard">
          <button style={buttonStyle} onClick={handleCopyCode}>📋</button>
        </Tooltip>
      </div>
      <img 
        src={svgSource} 
        alt="Mermaid Chart" 
        style={{ 
          display: 'block',
          maxWidth: '50%',
          height: '50%',
          marginTop: '20px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          transition: 'transform 0.3s ease',
          filter: darkMode ? 'invert(1) hue-rotate(180deg)' : 'none' 
        }} 
      />
      <Alert message={alertMessage} isVisible={showAlert} onHide={hideAlert} />
    </>
  ) : null
}