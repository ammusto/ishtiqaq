import React from 'react';
import './CharacterGroup.css';

const CharacterGroup = ({ charOptions, selectedChar, handleOptionChange, handleAddChar, additionalChars, setAdditionalChars, setSelectedChar }) => {
    return (
        <div className="char-options">
            <div className='alternative-chars'>
                {charOptions[selectedChar].options.map((opt, idx) => (
                    <label key={idx}>
                        {opt}
                        <input
                            type="checkbox"
                            value={opt}
                            checked={charOptions[selectedChar].checkedOptions.includes(opt)}
                            onChange={handleOptionChange}
                        />
                    </label>
                ))}
                {charOptions[selectedChar].additionalCharsList.map((char, idx) => (
                    <label key={idx}>
                        {char}
                        <input
                            type="checkbox"
                            value={char}
                            checked={charOptions[selectedChar].checkedOptions.includes(char)}
                            onChange={handleOptionChange}
                        />
                    </label>
                ))}
            </div>

            <div>
                <input
                    type="text"
                    className="additional-char-input"
                    value={additionalChars}
                    onChange={(e) => setAdditionalChars(e.target.value)}
                    maxLength="1"
                />
                <button className='link-button character-add-button' onClick={handleAddChar}>+</button>
            </div>
        </div>
    );
};

export default CharacterGroup;
