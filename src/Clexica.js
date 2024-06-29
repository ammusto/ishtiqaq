import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './Clexica.css';

const Clexica = () => {
  const { query } = useParams();
  const [tajData, setTajData] = useState(null);
  const [maqData, setMaqData] = useState(null);
  const [highlightEnabled, setHighlightEnabled] = useState(true);

  const fetchData = useCallback(async (dictionary) => {
    const indexFile = getIndexFile(query, dictionary);
  
    const indexResponse = await fetch(`/clexica/${dictionary}_index_files/${indexFile}`);
    if (!indexResponse.ok) {
      setNotFoundMessage(dictionary);
      return;
    }
    
    const indexText = await indexResponse.text();
    const indexLines = indexText.split('\n');
    
    const indexLine = indexLines.find(line => line.startsWith(query));
    
    if (!indexLine) {
      setNotFoundMessage(dictionary);
      return;
    }
    
    const [, jsonFile] = indexLine.split(',');
    
    const dataResponse = await fetch(`/clexica/${dictionary}_data/${jsonFile}`);
    if (!dataResponse.ok) {
      setNotFoundMessage(dictionary);
      return;
    }
    
    const dataJson = await dataResponse.json();
    
    const wordData = dataJson[query];
    if (!wordData) {
      setNotFoundMessage(dictionary);
      return;
    }
    
    if (dictionary === 'taj') {
      setTajData(wordData);
    } else {
      setMaqData(wordData);
    }
  }, [query]);

  useEffect(() => {
    if (query) {
      console.log(`Looking up query: ${query}`);
      fetchData('taj');
      fetchData('maq');
    }
  }, [query, fetchData]);
  
  const setNotFoundMessage = (dictionary) => {
    const notFoundData = { def: "Results not found", pg: "" };
    if (dictionary === 'taj') {
      setTajData(notFoundData);
    } else {
      setMaqData(notFoundData);
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? <em key={index}>{part}</em> : part
    );
  };

  const getIndexFile = (word, dictionary) => {
    const firstLetter = word.charAt(0);
    const letterMap = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const fileNumber = letterMap.indexOf(firstLetter) + 1;
    return `${dictionary}_index_${fileNumber}.txt`;
  };

  const renderDefinition = (definition) => {
    const paragraphs = definition.split(/\n/);
    return paragraphs.map((paragraph, index) => (
      <p className='arabic-font' key={index}>
        {highlightEnabled ? highlightText(paragraph, query) : paragraph}
      </p>
    ));
  };

  const toggleHighlight = () => {
    setHighlightEnabled(!highlightEnabled);
  };

  const formatPageNumber = (pgString) => {
    const parts = pgString.split('-');

    const formatPart = (part) => {
      const match = part.match(/V(\d+)P(\d+)/);
      if (match) {
        return {
          vol: parseInt(match[1], 10),
          page: parseInt(match[2], 10)
        };
      }
      return null;
    };

    if (parts.length === 1) {
      const formatted = formatPart(parts[0]);
      return formatted ? `vol. ${formatted.vol} pg. ${formatted.page}` : pgString;
    } else if (parts.length === 2) {
      const start = formatPart(parts[0]);
      const end = formatPart(parts[1]);

      if (start && end) {
        if (start.vol === end.vol) {
          return `Vol. ${start.vol} p. ${start.page}-${end.page}`;
        } else {
          return `Vol. ${start.vol} p. ${start.page} - vol. ${end.vol} p. ${end.page}`;
        }
      }
    }
    return pgString;
  };

  return (
    <div className='about m-auto'>
      <div className='center'>
        <button className='text-button' onClick={toggleHighlight}>
          {highlightEnabled ? "Remove Highlight" : "Add Highlight"}
        </button>
      </div>
      {(!tajData && !maqData ) && <div>Loading...</div>}
      {maqData && (
        <div>
          <h2 className='center m0'>Maqāyīs al-lugha ({query})</h2>
          <div className='clexica-result'>{renderDefinition(maqData.def)}</div>
          <p className='center'>{formatPageNumber(maqData.pg)}</p>
        </div>
      )}
      {tajData && (
        <div>
          <h2 className='center m0'>Tāj al-ʿarūs ({query})</h2>
          <div className='clexica-result'>{renderDefinition(tajData.def)}</div>
          <p className='center'>{formatPageNumber(tajData.pg)}</p>
        </div>
      )}
    </div>
  );
};

export default Clexica;