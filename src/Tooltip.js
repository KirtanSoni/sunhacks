import { useState } from "react"

export const Tooltip = ({ children, text }) => {
    const [show, setShow] = useState(false)

  
    return (
      <div className="tooltip-container" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        {children}
        {show && <div className="tooltip">{text}</div>}
        <style jsx>
            {` .tooltip-container {
          position: relative;
          display: inline-block;
        }
        .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #333;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          white-space: nowrap;
          z-index: 1;
          font-size: 14px;
        }`}
        </style>
      </div>
    )
  }