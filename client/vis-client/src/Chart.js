import React, { useEffect, useState } from 'react'
import mermaid from 'mermaid'

export default function Chart({ chartCode, darkMode}) {
  const [svgSource, setSvgSource] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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
          console.log(result.svg)
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

  if (isLoading) {
    return <div>Loading chart...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>
  }

  return svgSource ? (
    <img 
      src={svgSource} 
      alt="Mermaid Chart" 
      style={{ maxWidth: '75%', height: 'auto', filter: darkMode ? 'invert(1) hue-rotate(180deg)' : 'none' }} 
    />
  ) : null
}