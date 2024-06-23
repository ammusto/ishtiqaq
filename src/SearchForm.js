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

const SearchForm = ({ query, setQuery, setResults, setCurrentPage, index, setNoResults }) => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [charOptions, setCharOptions] = useState({});
  const [additionalChars, setAdditionalChars] = useState('');

  useEffect(() => {
    setCharOptions({});
    setSelectedChar(null);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    setResults([]);
    setNoResults(false);
    if (query) {
      searchWords(query);
    }
  };

  const searchWords = (pattern) => {
    const startingChars = new Set();
    pattern.split('').forEach(char => {
      if (charOptions[char] && charOptions[char].checkedOptions.length) {
        charOptions[char].checkedOptions.forEach(opt => startingChars.add(opt));
      } else {
        startingChars.add(char);
      }
    });

    let regexPattern = pattern.split('').map(char => {
      if (charOptions[char]) {
        const selectedOptions = charOptions[char].checkedOptions.join('') + charOptions[char].additionalCharsList.join('');
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

    let foundResults = false;

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
          if (matchedWords.length > 0) {
            foundResults = true;
          }
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
      if (allResults.length === 0) {
        setNoResults(true);
      }
    })
    .catch(error => {
      console.error('Error processing search results', error);
      setNoResults(true);
    });
  };

  const handleCharClick = (char) => {
    const group = findCharacterGroup(char);
    if (group) {
      if (!charOptions[char]) {
        setCharOptions({
          ...charOptions,
          [char]: {
            options: [char, ...group.filter(c => c !== char)],
            checkedOptions: [char],
            additionalCharsList: []
          }
        });
      }
    } else {
      if (!charOptions[char]) {
        setCharOptions({
          ...charOptions,
          [char]: {
            options: [],
            checkedOptions: [],
            additionalCharsList: []
          }
        });
      }
    }
    setSelectedChar(char);
  };

  const handleSelectAll = () => {
    setCharOptions({
      ...charOptions,
      [selectedChar]: {
        ...charOptions[selectedChar],
        checkedOptions: [...charOptions[selectedChar].options]
      }
    });
  };

  const handleRemoveAll = () => {
    setCharOptions({
      ...charOptions,
      [selectedChar]: {
        ...charOptions[selectedChar],
        checkedOptions: []
      }
    });
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    const options = charOptions[selectedChar];
    if (checked) {
      options.checkedOptions = [...options.checkedOptions, value];
    } else {
      options.checkedOptions = options.checkedOptions.filter(opt => opt !== value);
    }
    setCharOptions({
      ...charOptions,
      [selectedChar]: options
    });
  };
  const handleAddChar = () => {
    if (additionalChars && !charOptions[selectedChar].additionalCharsList.includes(additionalChars)) {
      const options = charOptions[selectedChar];
      options.additionalCharsList.push(additionalChars);
      options.checkedOptions.push(additionalChars); // Automatically check the new char
      setCharOptions({
        ...charOptions,
        [selectedChar]: options
      });
      setAdditionalChars('');
    }
  };

  const handleRemoveAdditionalChar = (char) => {
    setCharOptions({
      ...charOptions,
      [selectedChar]: {
        ...charOptions[selectedChar],
        additionalCharsList: charOptions[selectedChar].additionalCharsList.filter(c => c !== char)
      }
    });
  };

  return (
    <div className='search-form'>
      <input type="text" className='search-input' value={query} onChange={handleInputChange} placeholder="Search" />
      <LivePreview query={query} handleCharClick={handleCharClick} />
      {selectedChar && charOptions[selectedChar] && (
        <CharacterGroup 
          charOptions={charOptions} 
          selectedChar={selectedChar} 
          handleOptionChange={handleOptionChange} 
          handleAddChar={handleAddChar} 
          additionalChars={additionalChars} 
          setAdditionalChars={setAdditionalChars} 
          handleRemoveAdditionalChar={handleRemoveAdditionalChar} 
          handleSelectAll={handleSelectAll} 
          handleRemoveAll={handleRemoveAll} 
          setSelectedChar={setSelectedChar} 
        />
      )}
            <button onClick={handleSearchClick}>Search</button>

    </div>
  );
};

export default SearchForm;
