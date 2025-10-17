import React, { useState, useCallback, useMemo } from 'react';
import './SearchForm.css';
import CharacterGroup from './CharacterGroup';
import LivePreview from './LivePreview';

const characterGroups = {
  'دذرزون': ['د', 'ذ', 'ر', 'ز', 'و', 'ن'],
  'قفعغم': ['ق', 'ف', 'ع', 'غ', 'م'],
  'حجخصض': ['ح', 'ج', 'خ', 'ص', 'ض'],
  'بتثني': ['ب', 'ت', 'ث', 'ن', 'ي'],
  'سش': ['س', 'ش'],
  'طظ': ['ط', 'ظ'],
  'هة': ['ه', 'ة'],

};

const findCharacterGroup = (char) => {
  for (const group in characterGroups) {
    if (characterGroups[group].includes(char)) {
      return characterGroups[group];
    }
  }
  return null;
};

const SearchForm = ({ query, setQuery, setResults, setCurrentPage, index, setNoResults, handleSearchExecuted, setLoading, setQueryDisplay }) => {
  const [selectedCharIndex, setSelectedCharIndex] = useState(null);
  const [charOptions, setCharOptions] = useState({});
  const [additionalChars, setAdditionalChars] = useState('');
  const [taMarbutaFlag, setTaMarbutaFlag] = useState('True');
  const [alifFlag, setAlifFlag] = useState('True');
  const [prefixFlag, setPrefixFlag] = useState('');
  const [suffixFlag, setSuffixFlag] = useState('');

  const arabicPattern = useMemo(() => /^[\u0600-\u06FF\u0750-\u077F*]*$/, []);

  const handleAlifCheck = (e) => {
    setAlifFlag(e.target.checked)
  }
  const handleTaMarbutaCheck = (e) => {
    setTaMarbutaFlag(e.target.checked)
  }

  const handlePrefixCheck = (e) => {
    setPrefixFlag(e.target.checked)
  }
  const handleSuffixCheck = (e) => {
    setSuffixFlag(e.target.checked)
  }

  // In SearchForm.js, replace the searchWords function with this:

  const searchWords = useCallback((pattern) => {
    setCharOptions(currentCharOptions => {
      const normalizeChar = (char) => {
        const normalizationMap = {};

        if (alifFlag) {
          normalizationMap['ا'] = 'آاأإ';
        }
        if (taMarbutaFlag) {
          normalizationMap['ه'] = 'هة';
          normalizationMap['ة'] = 'هة';
        }

        return normalizationMap[char] || char;
      };

      const startingChars = new Set();

      const firstCharKey = `${pattern.charAt(0)}-0`;
      const firstChars = currentCharOptions[firstCharKey] && currentCharOptions[firstCharKey].checkedOptions.length
        ? currentCharOptions[firstCharKey].checkedOptions.map(char => normalizeChar(char))
        : [normalizeChar(pattern.charAt(0))];

      const secondCharKey = `${pattern.charAt(1)}-1`;
      const secondChars = currentCharOptions[secondCharKey] && currentCharOptions[secondCharKey].checkedOptions.length
        ? currentCharOptions[secondCharKey].checkedOptions.map(char => normalizeChar(char))
        : [normalizeChar(pattern.charAt(1))];

      firstChars.forEach(firstChar => {
        for (let i = 0; i < firstChar.length; i++) {
          const fc = firstChar[i];
          secondChars.forEach(secondChar => {
            for (let j = 0; j < secondChar.length; j++) {
              const sc = secondChar[j];
              startingChars.add(fc + sc);
            }
          });
        }
      });

      const prefixes = ['ف', 'ل', 'و', 'ن', 'ي', 'ت', 'ال', 'ك', 'س'];
      const suffixes = ['ه', 'ها', 'هم', 'هن', 'هما', 'ني', 'ك', 'كم', 'كما', 'ن', 'نا', 'هة'];

      let regexPattern = pattern.split('').map((char, index) => {
        const optionsKey = `${char}-${index}`;
        if (currentCharOptions[optionsKey]) {
          const selectedOptions = currentCharOptions[optionsKey].checkedOptions.join('') + currentCharOptions[optionsKey].additionalCharsList.join('');
          return `[${selectedOptions}]`;
        }
        return `[${normalizeChar(char)}]`;
      }).join('');

      if (prefixFlag) {
        for (const prefix of prefixes) {
          const prefixPattern = `[${prefix}]`;
          if (regexPattern.startsWith(prefixPattern)) {
            regexPattern = `${prefixPattern}?${regexPattern.slice(prefixPattern.length)}`;
            break;
          }
        }
      }

      if (suffixFlag) {
        for (const suffix of suffixes) {
          const suffixPattern = `[${suffix}]`;
          if (regexPattern.endsWith(suffixPattern)) {
            regexPattern = `${regexPattern.slice(0, -suffixPattern.length)}${suffixPattern}?`;
            break;
          }
        }
      }

      regexPattern = new RegExp('^' + regexPattern.replace(/\[\*\]/g, '.') + '$', 'i');

      let filesToSearch = index.filter(entry => {
        const minWord = entry.firstWord.replace(/\*/g, '');
        const maxWord = entry.lastWord.replace(/\*/g, '');
        const minInitial = minWord.substring(0, 2);
        const maxInitial = maxWord.substring(0, 2);

        return Array.from(startingChars).some(char => char >= minInitial && char <= maxInitial);
      });

      // Use Web Worker for heavy lifting
      const workerPromises = filesToSearch.map(entry => {
        return new Promise((resolve) => {
          // Create a new worker for each file
          const worker = new Worker(`${process.env.PUBLIC_URL}/searchWorker.js`);

          // Send the file path and regex pattern to the worker
          worker.postMessage({
            filePath: `${process.env.PUBLIC_URL}/${entry.file}`,
            regexPattern: {
              pattern: regexPattern.source,
              flags: regexPattern.flags
            }
          });

          // Listen for results
          worker.onmessage = (event) => {
            if (event.data.success) {
              resolve(event.data.matchedWords);
            } else {
              console.error('Worker error:', event.data.error);
              resolve([]);
            }
            worker.terminate();
          };

          // Handle worker errors
          worker.onerror = (error) => {
            console.error('Worker execution error:', error);
            resolve([]);
            worker.terminate();
          };
        });
      });

      Promise.all(workerPromises)
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
          console.error('Search error:', error);
          setLoading(false);
          handleSearchExecuted();
          setNoResults(true);
        });

      return currentCharOptions;
    });
  }, [index, setResults, setLoading, handleSearchExecuted, setNoResults, alifFlag, taMarbutaFlag, prefixFlag, suffixFlag]);

  const handleSearchClick = useCallback(() => {
    setSelectedCharIndex(null);
    setCurrentPage(1);
    setResults([]);
    setNoResults(false);
    setLoading(true);
    if (query) {
      searchWords(query);
      setQueryDisplay(query);
    }
  }, [query, setCurrentPage, setResults, setNoResults, setLoading, setQueryDisplay, searchWords]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter' && query.length > 0) {
      handleSearchClick();
    }
  }, [handleSearchClick, query.length]);

  const handleCharClick = useCallback((char, index) => {
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
  }, [charOptions]);

  const handleOptionChange = useCallback((e) => {
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
  }, [selectedCharIndex, charOptions]);

  const handleSelectAll = useCallback(() => {
    const options = charOptions[selectedCharIndex];
    setCharOptions({
      ...charOptions,
      [selectedCharIndex]: {
        ...options,
        checkedOptions: [...options.options]
      }
    });
  }, [selectedCharIndex, charOptions]);

  const handleRemoveAll = useCallback(() => {
    const options = charOptions[selectedCharIndex];
    setCharOptions({
      ...charOptions,
      [selectedCharIndex]: {
        ...options,
        checkedOptions: options.checkedOptions.slice(0, 1)
      }
    });
  }, [selectedCharIndex, charOptions]);


  const handleAddChar = useCallback(() => {
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
  }, [selectedCharIndex, charOptions, additionalChars]);

  const handleRemoveAdditionalChar = useCallback((char) => {
    const options = charOptions[selectedCharIndex];
    setCharOptions({
      ...charOptions,
      [selectedCharIndex]: {
        ...options,
        additionalCharsList: options.additionalCharsList.filter(c => c !== char)
      }
    });
  }, [selectedCharIndex, charOptions]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    if (arabicPattern.test(value) || value === "") {
      setQuery(value);
    } else {
      const filteredValue = value.split('').filter(char => arabicPattern.test(char)).join('');
      setQuery(filteredValue);
    }
  }, [setQuery, arabicPattern]);

  return (
    <div className='search-form m-auto'>
      <input
        type="text"
        className='search-input arabic-font p5 br5'
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder=""
      />
      <div className='normalization-container'>
        <label>
          ة
          <input
            type="checkbox"
            checked={taMarbutaFlag}
            onChange={handleTaMarbutaCheck}
          />
        </label>
        <label>
          ء
          <input
            type="checkbox"
            checked={alifFlag}
            onChange={handleAlifCheck}
          />
        </label>

        <label>
          س
          <input
            type="checkbox"
            checked={prefixFlag}
            onChange={handlePrefixCheck}
          />
        </label>
        <label>
          ل
          <input
            type="checkbox"
            checked={suffixFlag}
            onChange={handleSuffixCheck}
          />
        </label>
      </div>
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
      <button className='search-button p5' onClick={handleSearchClick} disabled={query.length === 0}>Search</button>
    </div>
  );
};

export default SearchForm;