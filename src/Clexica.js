import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './Clexica.css';

const Clexica = () => {
  const { query } = useParams();
  const [tajData, setTajData] = useState(null);
  const [maqData, setMaqData] = useState(null);
  const [sihahData, setSihahData] = useState(null);
  const [muhitData, setMuhitData] = useState(null);
  const [lisanData, setLisanData] = useState(null);
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [expandedDictionaries, setExpandedDictionaries] = useState({
    maq: false,
    taj: false,
    sihah: false,
    muhit: false,
    lisan: false,
  });

  const fetchData = useCallback(async (dictionary) => {
    let modifiedQuery = query.replace(/ء/g, 'أ');
    const indexFile = getIndexFile(modifiedQuery, dictionary);
    console.log(dictionary);

    const indexResponse = await fetch(`/clexica/${dictionary}_indices/${indexFile}`);
    console.log("indexfile", indexFile);
    if (!indexResponse.ok) {
      setNotFoundMessage(dictionary);
      return;
    }

    const indexText = await indexResponse.text();
    const indexLines = indexText.split('\n');

    let indexLine = indexLines.find(line => line.startsWith(modifiedQuery));


    if (!indexLine && dictionary === 'maq' && modifiedQuery.endsWith('ى')) {
      modifiedQuery = modifiedQuery.slice(0, -1) + 'وى';
      indexLine = indexLines.find(line => line.startsWith(modifiedQuery));
    }

    if (!indexLine && dictionary === 'maq' && modifiedQuery.endsWith('ووى')) {
      modifiedQuery = modifiedQuery.slice(0, -1) + 'ي';
      indexLine = indexLines.find(line => line.startsWith(modifiedQuery));
    }

    if (!indexLine && modifiedQuery.endsWith('ي')) {
      modifiedQuery = modifiedQuery.slice(0, -1) + 'ى';
      indexLine = indexLines.find(line => line.startsWith(modifiedQuery));
    }

    if (!indexLine && modifiedQuery.endsWith('و')) {
      modifiedQuery = modifiedQuery.slice(0, -1) + 'ا';
      indexLine = indexLines.find(line => line.startsWith(modifiedQuery));
    }

    if (!indexLine && modifiedQuery.endsWith('ا')) {
      modifiedQuery = modifiedQuery.slice(0, -1) + 'ى';
      indexLine = indexLines.find(line => line.startsWith(modifiedQuery));
    }


    if (!indexLine && modifiedQuery.endsWith('ى')) {
      modifiedQuery = modifiedQuery.slice(0, -1) + 'ا';
      indexLine = indexLines.find(line => line.startsWith(modifiedQuery));
    }

    if (!indexLine && modifiedQuery.endsWith('ا')) {
      modifiedQuery = modifiedQuery.slice(0, -1) + 'و';
      indexLine = indexLines.find(line => line.startsWith(modifiedQuery));
    }

    if (!indexLine) {
      setNotFoundMessage(dictionary);
      return;
    }


    console.log("line", indexLine);

    const [, jsonFile] = indexLine.split(',');
    console.log(jsonFile)
    const dataResponse = await fetch(`/clexica/${dictionary}_data/${jsonFile}`);
    console.log(jsonFile);
    if (!dataResponse.ok) {
      setNotFoundMessage(dictionary);
      return;
    }

    const dataJson = await dataResponse.json();

    let wordData = dataJson[modifiedQuery];


    if (!wordData && dictionary === 'maq' && modifiedQuery.endsWith('و')) {
      modifiedQuery = modifiedQuery.slice(0, -1) + 'وى';
      wordData = dataJson[modifiedQuery];
    }


    if (!wordData) {
      setNotFoundMessage(dictionary);
      return;
    }

    if (dictionary === 'taj') {
      setTajData(wordData);
    } else if (dictionary === 'maq') {
      setMaqData(wordData);
    } else if (dictionary === 'muhit') {
      setMuhitData(wordData);
    } else if (dictionary === 'lisan') {
      setLisanData(wordData);
    } else {
      setSihahData(wordData);
    }
  }, [query]);

  useEffect(() => {
    if (query) {
      fetchData('taj');
      fetchData('maq');
      fetchData('sihah');
      fetchData('muhit');
      fetchData('lisan');
    }
  }, [query, fetchData]);

  const setNotFoundMessage = (dictionary) => {
    const notFoundData = { def: "Results not found", pg: "" };
    if (dictionary === 'taj') {
      setTajData(notFoundData);
    } else if (dictionary === 'maq') {
      setMaqData(notFoundData);
    } else if (dictionary === 'muhit') {
      setMuhitData(notFoundData);
    } else if (dictionary === 'lisan') {
      setLisanData(notFoundData);
    } else {
      setSihahData(notFoundData);
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
    let firstLetter = word.charAt(0);

    const letterMap = 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي';
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

  const toggleExpand = (dictionary) => {
    setExpandedDictionaries(prev => ({
      ...prev,
      [dictionary]: !prev[dictionary]
    }));
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
        {/* <div> Jump to:
        {maqData && <a href="#maqayis">Maqāyīs</a>}
        {tajData && <a href="#taj">Tāj</a>}
        {sihahData && <a href="#sihah">Ṣiḥāḥ</a>}
        </div> */}
      </div>
      {(!tajData && !maqData && !sihahData) && <div>Loading...</div>}
      {maqData && (
        <div id="maqayis" className={`classical-dictionary ${expandedDictionaries.maq ? 'expanded' : ''}`}>
          <h2 className='center m0'>Maqāyīs al-lugha ({query})</h2>
          <div className='clexica-result'>{renderDefinition(maqData.def)}</div>
          <p className='center'>{formatPageNumber(maqData.pg)}</p>
          <div className="gradient-overlay"></div>
          <button className="expand-button" onClick={() => toggleExpand('maq')}>
            {expandedDictionaries.maq ? '▲' : '▼'}
          </button>
        </div>
      )}
      {sihahData && (
        <div id="sihah" className={`classical-dictionary ${expandedDictionaries.sihah ? 'expanded' : ''}`}>
          <h2 className='center m0'>al-Ṣiḥāḥ ({query})</h2>
          <div className='clexica-result'>{renderDefinition(sihahData.def)}</div>
          <p className='center'>{formatPageNumber(sihahData.pg)}</p>
          <div className="gradient-overlay"></div>
          <button className="expand-button" onClick={() => toggleExpand('sihah')}>
            {expandedDictionaries.sihah ? '▲' : '▼'}
          </button>
        </div>
      )}
      {tajData && (
        <div id="taj" className={`classical-dictionary ${expandedDictionaries.taj ? 'expanded' : ''}`}>
          <h2 className='center m0'>Tāj al-ʿarūs ({query})</h2>
          <div className='clexica-result'>{renderDefinition(tajData.def)}</div>
          <p className='center'>{formatPageNumber(tajData.pg)}</p>
          <div className="gradient-overlay"></div>
          <button className="expand-button" onClick={() => toggleExpand('taj')}>
            {expandedDictionaries.taj ? '▲' : '▼'}
          </button>
        </div>
      )}
      {muhitData && (
        <div id="muhit" className={`classical-dictionary ${expandedDictionaries.muhit ? 'expanded' : ''}`}>
          <h2 className='center m0'>al-Muḥīt fī al-lugha ({query})</h2>
          <div className='clexica-result'>{renderDefinition(muhitData.def)}</div>
          <p className='center'>{formatPageNumber(muhitData.pg)}</p>
          <div className="gradient-overlay"></div>
          <button className="expand-button" onClick={() => toggleExpand('muhit')}>
            {expandedDictionaries.taj ? '▲' : '▼'}
          </button>
        </div>
      )}
      {lisanData && (
        <div id="lisan" className={`classical-dictionary ${expandedDictionaries.lisan ? 'expanded' : ''}`}>
          <h2 className='center m0'>Lisān al-ʿArab ({query})</h2>
          <div className='clexica-result'>{renderDefinition(lisanData.def)}</div>
          <p className='center'>{formatPageNumber(lisanData.pg)}</p>
          <div className="gradient-overlay"></div>
          <button className="expand-button" onClick={() => toggleExpand('lisan')}>
            {expandedDictionaries.lisan ? '▲' : '▼'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Clexica;