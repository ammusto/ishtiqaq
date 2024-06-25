import React, { useCallback, memo } from 'react';
import './CharacterGroup.css';

const CharacterGroup = memo(({
  charOptions, selectedCharIndex, handleOptionChange, handleAddChar, additionalChars, setAdditionalChars, setSelectedCharIndex, arabicPattern
}) => {
  const options = charOptions[selectedCharIndex] || { options: [], checkedOptions: [], additionalCharsList: [] };

  const handleInputChange = useCallback((e) => {
    if (arabicPattern.test(e.target.value) || e.target.value === "") {
      setAdditionalChars(e.target.value);
    }
  }, [setAdditionalChars, arabicPattern]);

  const canAddChar = additionalChars && !options.options.includes(additionalChars) && !options.additionalCharsList.includes(additionalChars);

  return (
    <div className="char-options">
      <div className='alternative-chars'>
        <button className="close-button" onClick={() => setSelectedCharIndex(null)}>x</button>
        {options.options.map((opt, idx) => (
          <label key={idx}>
            {opt}
            <input
              type="checkbox"
              value={opt}
              checked={options.checkedOptions.includes(opt)}
              onChange={e => handleOptionChange(e, selectedCharIndex)}
            />
          </label>
        ))}
        {options.additionalCharsList.map((char, idx) => (
          <label key={idx}>
            {char}
            <input
              type="checkbox"
              value={char}
              checked={options.checkedOptions.includes(char)}
              onChange={e => handleOptionChange(e, selectedCharIndex, true)}
            />
          </label>
        ))}
        <div className='add-char-container'>
          <input
            type="text"
            className="additional-char-input"
            value={additionalChars}
            onChange={handleInputChange}
            maxLength="1"
          />
          <button className='link-button add-char-button' disabled={!canAddChar} onClick={() => handleAddChar(selectedCharIndex)}>+</button>
        </div>
      </div>
    </div>
  );
});

export default CharacterGroup;