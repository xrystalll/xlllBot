import React from 'react';

export const Loader = () => {
  return (
    <div className="content_loader">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#fff" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(359.289 50.0009 50.0009)">
          <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1.2s" begin="0s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}
