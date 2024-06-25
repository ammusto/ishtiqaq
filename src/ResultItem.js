import React, { memo, useMemo, useCallback } from 'react';
import DataLoader from './DataLoader';
import './Results.css';

const ResultItem = memo(({ result, hwIndex, sgIndex, llIndex, lsIndex, haIndex, rootDefinitionList }) => {
  const [word, roots] = result.split('#');
  const rootList = roots.split(',');

  const wordLinks = useCallback((term) => ({
    hw: DataLoader.findPageImage(term, 'hw', hwIndex),
    sg: DataLoader.findPageImage(term, 'sg', sgIndex),
    ll: DataLoader.findPageImage(term, 'll', llIndex),
    ls: DataLoader.findPageImage(term, 'ls', lsIndex),
    ha: DataLoader.findPageImage(term, 'ha', haIndex),
  }), [hwIndex, sgIndex, llIndex, lsIndex, haIndex]);

  const wordLinksResult = useMemo(() => wordLinks(word), [word, wordLinks]);

  const renderRootResult = useCallback((root, rIdx) => {
    const definitions = DataLoader.findDefinition(root, rootDefinitionList);
    const rootLinksResult = wordLinks(root);

    return (
      <div key={rIdx} className='root-result'>
         <span className='arabic-font large-font root-display'>{root}</span>
        <div className='root-definition'>
          <ul>
            {definitions.map((definition, dIdx) => (
              <li key={dIdx}>{definition}</li>
            ))}
          </ul>
        </div>
        <div className='result-link-container'>
          <a className='result-link' href={`https://ejtaal.net/aa/#hw4=${rootLinksResult.hw},sg=${rootLinksResult.sg},ll=${rootLinksResult.ll},ls=${rootLinksResult.ls},ha=${rootLinksResult.ha}`} target="_blank" rel="noopener noreferrer">HW</a>/
          <a className='result-link' href={`https://ejtaal.net/aa/#sg=${rootLinksResult.sg},hw4=${rootLinksResult.hw},ll=${rootLinksResult.ll},ls=${rootLinksResult.ls},ha=${rootLinksResult.ha}`} target="_blank" rel="noopener noreferrer">SG</a>/
          <a className='result-link' href={`https://ejtaal.net/aa/#ll=${rootLinksResult.ll},ls=${rootLinksResult.ls},hw4=${rootLinksResult.hw},sg=${rootLinksResult.sg},ha=${rootLinksResult.ha}`} target="_blank" rel="noopener noreferrer">LL</a>/
          <a className='result-link' href={`https://ejtaal.net/aa/#ha=${rootLinksResult.ha},hw4=${rootLinksResult.hw},sg=${rootLinksResult.sg},ll=${rootLinksResult.ll},ls=${rootLinksResult.ls}`} target="_blank" rel="noopener noreferrer">HA</a>
        </div>
      </div>
    );
  }, [wordLinks, rootDefinitionList]);

  return (
    <div className='search-result'>
      <div className='word-result'>
        <div><span className='arabic-font'>{word}</span></div>
        <div className='alphabetical-result'>
          <div>
            <a className='result-link' href={`https://ejtaal.net/aa/#hw4=${wordLinksResult.hw},sg=${wordLinksResult.sg},ll=${wordLinksResult.ll},ls=${wordLinksResult.ls},ha=${wordLinksResult.ha}`} target="_blank" rel="noopener noreferrer">HW(a)</a>/
            <a className='result-link' href={`https://ejtaal.net/aa/#sg=${wordLinksResult.sg},hw4=${wordLinksResult.hw},ll=${wordLinksResult.ll},ls=${wordLinksResult.ls},ha=${wordLinksResult.ha}`} target="_blank" rel="noopener noreferrer">SG(a)</a>
          </div>
        </div>
      </div>
      <div className='root-result-list'>
        {rootList.map(renderRootResult)}
      </div>
    </div>
  );
});

export default ResultItem;