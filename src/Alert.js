import { useEffect } from "react"

export const Alert = ({ message, isVisible, onHide }) => {
    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => {
          onHide()
        }, 3000)
        return () => clearTimeout(timer)
      }
    }, [isVisible, onHide])
  
    if (!isVisible) return null
  
    return (
      <div className="alert">
        {message}
        <style jsx>{`
          .alert {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `}</style>
      </div>
    )
  }