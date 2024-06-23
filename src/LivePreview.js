import React, { useState } from 'react';
import './LivePreview.css';
const LivePreview = ({ query, handleCharClick }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleClick = (char, index) => {
    handleCharClick(char);
    setSelectedIndex(index);
  };

  return (
    <div className="live-preview">
      {query.split('').map((char, index) => (
        <span 
          key={index} 
          className={`live-preview-char ${index === selectedIndex ? 'selected-char' : ''}`} 
          onClick={() => handleClick(char, index)}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default LivePreview;
