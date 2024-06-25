const DataLoader = {
  findPageImage: (root, dictionary, indexData) => {
    if (typeof root !== 'string') {
      console.error('Invalid root: Expected a string', root);
      return '#'; // Handle this case appropriately.
    }

    // Normalize the root
    let normalizedRoot = root.replace(/ي$/, 'ى').trim(); // Convert final ي to ى
    if (normalizedRoot.length > 1 && normalizedRoot[normalizedRoot.length - 1] === normalizedRoot[normalizedRoot.length - 2]) {
      normalizedRoot = normalizedRoot.slice(0, -1); // Remove duplicate last character
    }

    if (!indexData || Object.keys(indexData).length === 0) {
      console.error(`${dictionary} index is empty or not loaded.`);
      return '#'; // Provide a fallback URL or handle this case appropriately.
    }

    // Handle entries by trimming any extraneous whitespace
    const cleanedEntries = Object.entries(indexData).map(([key, value]) => [key.trim(), value]);
    const sortedEntries = cleanedEntries.sort((a, b) => a[0].localeCompare(b[0]));

    let page = null;

    for (let i = 0; i < sortedEntries.length; i++) {
      if (sortedEntries[i][0] === normalizedRoot || normalizedRoot.localeCompare(sortedEntries[i][0]) < 0) {
        page = sortedEntries[i][1];
        return generateImagePath(page, dictionary);
      }
    }

    // If no match is found, use the last page
    page = sortedEntries[sortedEntries.length - 1][1];
    return generateImagePath(page, dictionary);
  }
};

function generateImagePath(page, dictionary) {
  return `${page.toString().padStart(4, '0')}`;
}

export default DataLoader;
