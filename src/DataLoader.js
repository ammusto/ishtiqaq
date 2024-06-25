const DataLoader = {
  findPageImage: (root, dictionary, indexData) => {
    if (typeof root !== 'string') {
      console.error('Invalid root: Expected a string', root);
      return '#';
    }

    let normalizedRoot = root.replace(/ي/g, 'ى').trim();
    if (normalizedRoot.length > 1 && normalizedRoot[normalizedRoot.length - 1] === normalizedRoot[normalizedRoot.length - 2]) {
      normalizedRoot = normalizedRoot.slice(0, -1);
    }

    if (!indexData || Object.keys(indexData).length === 0) {
      console.error(`${dictionary} index is empty or not loaded.`);
      return '#';
    }

    const sortedEntries = Object.entries(indexData)
      .map(([key, value]) => [key.trim(), value])
      .sort((a, b) => a[0].localeCompare(b[0]));

    let left = 0;
    let right = sortedEntries.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = normalizedRoot.localeCompare(sortedEntries[mid][0]);

      if (comparison === 0) {
        return generateImagePath(sortedEntries[mid][1], dictionary);
      } else if (comparison < 0) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // if no exact match is found, use the closest entry
    const page = sortedEntries[left] ? sortedEntries[left][1] : sortedEntries[sortedEntries.length - 1][1];
    return generateImagePath(page, dictionary);
  },

  findDefinition: (root, indexData) => {
    if (typeof root !== 'string') {
      console.error('Invalid root: Expected a string', root);
      return []; 
    }

    if (!indexData || Object.keys(indexData).length === 0) {
      console.error('Index data is empty or not loaded.');
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
      return ['No Quick Definition Found. Look at Steingass, Hava, or Lane.']; 
    }

    return definitions.map(definition => definition.trim());
  }
};

function generateImagePath(page, dictionary) {
  return `${page.toString().padStart(4, '0')}`;
}

export default DataLoader;
