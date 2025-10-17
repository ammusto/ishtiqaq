const DataLoader = {
  findPage: (root, dictionary, indexData) => {
    if (typeof root !== 'string') {
      console.error('Invalid root: Expected a string', root);
      return '#';
    }

    let normalizedRoot = root.replace(/ي/g, 'ى').trim();
    if (normalizedRoot.length > 1 && normalizedRoot[normalizedRoot.length - 1] === normalizedRoot[normalizedRoot.length - 2]) {
      normalizedRoot = normalizedRoot.slice(0, -1);
    }

    if (!indexData || Object.keys(indexData).length === 0) {
      console.warn(`${dictionary} index is empty or not loaded.`);
      return '#';
    }

    // Convert to sorted array of [root, pageNumber] pairs
    const sortedEntries = Object.entries(indexData)
      .map(([key, value]) => [key.trim(), value])
      .sort((a, b) => a[0].localeCompare(b[0]));

    // Linear search for exact match (simpler and more reliable)
    for (const [key, pageNum] of sortedEntries) {
      if (key === normalizedRoot) {
        return getPage(pageNum, dictionary);
      }
    }

    // If no exact match, find closest match
    let closest = sortedEntries[0][1];
    for (const [key, pageNum] of sortedEntries) {
      if (key.localeCompare(normalizedRoot) <= 0) {
        closest = pageNum;
      } else {
        break;
      }
    }

    return getPage(closest, dictionary);
  },

  findDefinition: (root, indexData) => {
    if (typeof root !== 'string') {
      console.error('Invalid root: Expected a string', root);
      return []; 
    }

    if (!indexData || Object.keys(indexData).length === 0) {
      console.warn('Definition index is empty or not loaded.');
      return [];
    }

    // normalize the root by replacing both ي and ى with a placeholder regex
    const normalizedRoot = root
      .replace(/[يى]/g, '[يى]')
      .replace(/[أء]/g, '[أء]')
      .replace(/[و]$/, '[يى]')
      .trim();
    const rootRegex = new RegExp(`^${normalizedRoot}$`);

    // find the matching root in the index data
    const matchingRoot = Object.keys(indexData).find(key => rootRegex.test(key));
    const definitions = indexData[matchingRoot];
    
    if (!definitions) {
      return ['No Quick Definition Found. Check dictionaries below, especially Steingass and Hava.']; 
    }

    return definitions.map(definition => definition.trim());
  }
};

function getPage(page, dictionary) {
  if (typeof page !== 'number') {
    console.warn(`Expected number for page, got ${typeof page}:`, page);
    return '#';
  }
  return `${page.toString().padStart(4, '0')}`;
}

export default DataLoader;