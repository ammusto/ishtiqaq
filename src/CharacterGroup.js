import React, { useCallback, memo } from 'react';
import './CharacterGroup.css';

const CharacterGroup = memo(({
  charOptions, selectedCharIndex, handleOptionChange, handleAddChar, additionalChars, setAdditionalChars, setSelectedCharIndex, arabicPattern, handleRemoveAll
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
      <div className='alternative-chars flex m-auto'>
        <button className="close-button" onClick={() => handleRemoveAll()}>Reset</button>
        {options.options.map((opt, idx) => (
          <label key={idx} className='p5 br5'>
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
          <label key={idx} className='p5 br5'>
            {char}
            <input
              type="checkbox"
              value={char}
              checked={options.checkedOptions.includes(char)}
              onChange={e => handleOptionChange(e, selectedCharIndex, true)}
            />
          </label>
        ))}
        <div className='add-char-container p5'>
          <input
            type="text"
            className="additional-char-input br5"
            value={additionalChars}
            onChange={handleInputChange}
            maxLength="1"
          />
          <button className='link-button add-char-button m0' disabled={!canAddChar} onClick={() => handleAddChar(selectedCharIndex)}>+</button>

        </div>
        <button className="close-button" onClick={() => setSelectedCharIndex(null)}>Close</button>

      </div>
    </div>
  );
});

export default CharacterGroup;