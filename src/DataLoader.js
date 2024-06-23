const DataLoader = {
  findPageImage: (root, dictionary, indexData) => {
    // normalize the root
    let normalizedRoot = root.replace(/ي$/, 'ى').trim(); // convert final ي to ى
    if (normalizedRoot.length > 1 && normalizedRoot[normalizedRoot.length - 1] === normalizedRoot[normalizedRoot.length - 2]) {
      normalizedRoot = normalizedRoot.slice(0, -1); // remove the last character if it is the same as the second last character
    }

    if (Object.keys(indexData).length === 0) {
      console.error(`${dictionary} index is empty or not loaded.`);
      return '#'; // provide a fallback URL or handle this case appropriately.
    }

    // properly handle entries by trimming any extraneous whitespace
    const cleanedEntries = Object.entries(indexData).map(([key, value]) => [key.trim(), value]);
    const sortedEntries = cleanedEntries.sort((a, b) => a[0].localeCompare(b[0]));

    let page = null;

    for (let i = 0; i < sortedEntries.length; i++) {
      if (sortedEntries[i][0] === normalizedRoot || normalizedRoot.localeCompare(sortedEntries[i][0]) < 0) {
        page = sortedEntries[i][1];
        return generateImagePath(page, dictionary);
      }
    }

    // if no match found (shouldn't happen if data is correctly structured), use the last page
    page = sortedEntries[sortedEntries.length - 1][1];
    return generateImagePath(page, dictionary);
  }
};
console.count("DataLoader")

  
  function generateImagePath(page, dictionary) {
    // const folder = Math.floor(page / 100);
    // return `${process.env.PUBLIC_URL}/${dictionary}/${folder}/${dictionary}-${page.toString().padStart(4, '0')}.png`;

    if (dictionary === 'hw') {
      return `https://ejtaal.net/aa/#hw4=${page.toString().padStart(4, '0')}`;
    } else if (dictionary === 'sg') {
      return `https://ejtaal.net/aa/#sg=${page.toString().padStart(4, '0')}`;
    }
}

export default DataLoader;
