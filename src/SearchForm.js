import React, { useState, useEffect } from 'react';
import './SearchForm.css';
import CharacterGroup from './CharacterGroup';
import LivePreview from './LivePreview';

const characterGroups = {
  'دذرزون': ['د', 'ذ', 'ر', 'ز', 'و', 'ن'],
  'قفعغم': ['ق', 'ف', 'ع', 'غ', 'م'],
  'حجخصض': ['ح', 'ج', 'خ', 'ص', 'ض'],
  'بتثني': ['ب', 'ت', 'ث', 'ن', 'ي'],
  'سش': ['س', 'ش'],
  'طظ': ['ط', 'ظ']
};

const findCharacterGroup = (char) => {
  for (const group in characterGroups) {
    if (characterGroups[group].includes(char)) {
      return characterGroups[group];
    }
  }
  return null;
};

const SearchForm = ({ query, setQuery, setResults, setCurrentPage, index, setNoResults, handleSearchExecuted, setLoading }) => {
  const [selectedCharIndex, setSelectedCharIndex] = useState(null);
  const [charOptions, setCharOptions] = useState({});
  const [additionalChars, setAdditionalChars] = useState('');
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;

  console.count("SearchForm")

  useEffect(() => {
    setCharOptions({});
    setSelectedCharIndex(null);
  }, [query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (arabicPattern.test(value) || value === "") {
      setQuery(value);
    }
  };
  

  const handleSearchClick = () => {
    setSelectedCharIndex(null);
    setCurrentPage(1);
    setResults([]);
    setNoResults(false);
    setLoading(true); 
    if (query) {
      searchWords(query);
    }
  };

  const searchWords = (pattern) => {
    const startingChars = new Set();
    pattern.split('').forEach((char, index) => {
      const optionsKey = `${char}-${index}`;
      if (charOptions[optionsKey] && charOptions[optionsKey].checkedOptions.length) {
        charOptions[optionsKey].checkedOptions.forEach(opt => startingChars.add(opt));
      } else {
        startingChars.add(char);
      }
    });

    let regexPattern = pattern.split('').map((char, index) => {
      const optionsKey = `${char}-${index}`;
      if (charOptions[optionsKey]) {
        const selectedOptions = charOptions[optionsKey].checkedOptions.join('') + charOptions[optionsKey].additionalCharsList.join('');
        return `[${selectedOptions}]`;
      }
      return char;
    }).join('');

    regexPattern = new RegExp('^' + regexPattern.replace(/\*/g, '.') + '$', 'i');

    let filesToSearch = index.filter(entry => {
      const minWord = entry.firstWord.replace(/\*/g, '');
      const maxWord = entry.lastWord.replace(/\*/g, '');
      const minInitial = minWord.charAt(0);
      const maxInitial = maxWord.charAt(0);

      return Array.from(startingChars).some(char => char >= minInitial && char <= maxInitial);
    });

    Promise.all(filesToSearch.map(entry => {
      const filePath = `${process.env.PUBLIC_URL}/${entry.file}`;
      return fetch(filePath)
        .then(response => response.text())
        .then(data => {
          const words = data.trim().split('\n');
          const matchedWords = words.filter(line => {
            const word = line.split('#')[0];
            const isMatch = regexPattern.test(word);
            return isMatch;
          });

          return matchedWords;
        })
        .catch(error => {
          console.error(`Error searching in file: ${filePath}`, error);
          return [];
        });
    }))
      .then(resultsArrays => {
        const allResults = resultsArrays.flat();
        setResults(allResults);
        setLoading(false);
        handleSearchExecuted();
        if (allResults.length === 0) {
          setNoResults(true);
        }
      })
      .catch(error => {
        console.error('Error processing search results', error);
        setLoading(false); 
        handleSearchExecuted(); 
        setNoResults(true);
      });
  };

  const handleCharClick = (char, index) => {
    const optionsKey = `${char}-${index}`;
    const group = findCharacterGroup(char);
    if (group) {
      if (!charOptions[optionsKey]) {
        setCharOptions(prev => ({
          ...prev,
          [optionsKey]: {
            options: group.filter(c => c !== char),
            checkedOptions: [char], 
            additionalCharsList: []
          }
        }));
      }
    } else {
      if (!charOptions[optionsKey]) {
        setCharOptions(prev => ({
          ...prev,
          [optionsKey]: {
            options: [],
            checkedOptions: [],
            additionalCharsList: []
          }
        }));
      }
    }
    setSelectedCharIndex(optionsKey);
  };

  const handleSelectAll = () => {
    const options = charOptions[selectedCharIndex];
    setCharOptions({
      ...charOptions,
      [selectedCharIndex]: {
        ...options,
        checkedOptions: [...options.options]
      }
    });
  };

  const handleRemoveAll = () => {
    const options = charOptions[selectedCharIndex];
    setCharOptions({
      ...charOptions,
      [selectedCharIndex]: {
        ...options,
        checkedOptions: []
      }
    });
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    const options = charOptions[selectedCharIndex];
    if (checked) {
      options.checkedOptions = [...options.checkedOptions, value];
    } else {
      options.checkedOptions = options.checkedOptions.filter(opt => opt !== value);
    }
    setCharOptions({
      ...charOptions,
      [selectedCharIndex]: options
    });
  };

  const handleAddChar = () => {
    if (additionalChars && !charOptions[selectedCharIndex].additionalCharsList.includes(additionalChars)) {
      const options = charOptions[selectedCharIndex];
      options.additionalCharsList.push(additionalChars);
      options.checkedOptions.push(additionalChars);
      setCharOptions({
        ...charOptions,
        [selectedCharIndex]: options
      });
      setAdditionalChars('');
    }
  };

  const handleRemoveAdditionalChar = (char) => {
    const options = charOptions[selectedCharIndex];
    setCharOptions({
      ...charOptions,
      [selectedCharIndex]: {
        ...options,
        additionalCharsList: options.additionalCharsList.filter(c => c !== char)
      }
    });
  };

  return (
    <div className='search-form'>
      <input type="text" className='search-input' value={query} onChange={handleInputChange} placeholder="" />
      <LivePreview
        query={query}
        handleCharClick={handleCharClick}
        charOptions={charOptions}
        setSelectedCharIndex={setSelectedCharIndex}
        selectedCharIndex={selectedCharIndex}
      />
      {selectedCharIndex != null && charOptions[selectedCharIndex] && (
        <CharacterGroup
        arabicPattern={arabicPattern}
          charOptions={charOptions}
          selectedCharIndex={selectedCharIndex}
          handleOptionChange={handleOptionChange}
          handleAddChar={handleAddChar}
          additionalChars={additionalChars}
          setAdditionalChars={setAdditionalChars}
          handleRemoveAdditionalChar={handleRemoveAdditionalChar}
          handleSelectAll={handleSelectAll}
          handleRemoveAll={handleRemoveAll}
          setSelectedCharIndex={setSelectedCharIndex}
        />
      )}
      <button className='search-button' onClick={handleSearchClick} disabled={query.length === 0}
      >Search</button>
    </div>
  );
};

export default SearchForm;
