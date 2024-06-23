const DataLoader = {
  findPageImage: (root, dictionary, indexData, alphabSearch) => {
    // Normalize the root
    let normalizedRoot = root.replace(/ي$/, 'ى').trim(); // Convert final ي to ى
    if (normalizedRoot.length > 1 && normalizedRoot[normalizedRoot.length - 1] === normalizedRoot[normalizedRoot.length - 2]) {
      normalizedRoot = normalizedRoot.slice(0, -1); // Remove the last character if it is the same as the second last character
    }

    if (Object.keys(indexData).length === 0) {
      console.error(`${dictionary} index is empty or not loaded.`);
      return '#'; // Provide a fallback URL or handle this case appropriately.
    }

    // Properly handle entries by trimming any extraneous whitespace
    const cleanedEntries = Object.entries(indexData).map(([key, value]) => [key.trim(), value]);
    const sortedEntries = cleanedEntries.sort((a, b) => a[0].localeCompare(b[0]));

    let page = null;

    for (let i = 0; i < sortedEntries.length; i++) {
      if (sortedEntries[i][0] === normalizedRoot || normalizedRoot.localeCompare(sortedEntries[i][0]) < 0) {
        page = sortedEntries[i][1];
        return generateImagePath(page, dictionary);
      }
    }

    // If no match found (shouldn't happen if data is correctly structured), use the last page
    page = sortedEntries[sortedEntries.length - 1][1];
    return generateImagePath(page, dictionary);
  }
};

function generateImagePath(page, dictionary) {
  const folder = Math.floor(page / 100);
  return `${process.env.PUBLIC_URL}/${dictionary}/${folder}/${dictionary}-${page.toString().padStart(4, '0')}.png`;
}

export default DataLoader;
