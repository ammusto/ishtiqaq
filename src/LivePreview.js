import React, { useCallback, memo } from 'react';
import './LivePreview.css';

const LivePreview = memo(({ query, handleCharClick, charOptions, setSelectedCharIndex, selectedCharIndex }) => {
  const handleClick = useCallback((char, index) => {
    if (char === '*') return; // Prevent action if the character is an asterisk
    const optionsKey = `${char}-${index}`;
    handleCharClick(char, index);
    setSelectedCharIndex(optionsKey);
  }, [handleCharClick, setSelectedCharIndex]);

  return (
    <div className="live-preview">
      {query.split('').map((char, index) => {
        const optionsKey = `${char}-${index}`;
        const additionalCount = charOptions[optionsKey] ? charOptions[optionsKey].checkedOptions.length - 1 : 0;
        return (
          <span key={index} className="live-preview-char-container">
            <span
              className={`live-preview-char ${optionsKey === selectedCharIndex ? 'selected-char' : ''}`}
              onClick={() => handleClick(char, index)}
            >
              {char}
            </span>
            <span className="live-preview-count m0">
              {additionalCount > 0 ? ` (${additionalCount + 1})` : ''}
            </span>
          </span>
        );
      })}
    </div>
  );
});

export default LivePreview;
