self.onmessage = async function(event) {
  const { filePath, regexPattern } = event.data;
  
  try {
    const response = await fetch(filePath);
    const data = await response.text();
    const words = data.trim().split('\n');
    
    // Create regex from the pattern string
    const regex = new RegExp(regexPattern.pattern, regexPattern.flags);
    
    // Filter matches
    const matchedWords = words.filter(line => {
      if (!line.trim()) return false;
      const word = line.split('#')[0];
      return regex.test(word);
    });
    
    // Send results back to main thread
    self.postMessage({
      success: true,
      matchedWords: matchedWords
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message
    });
  }
};