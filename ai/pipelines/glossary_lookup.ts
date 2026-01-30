// Simple glossary lookup helper (placeholder). 
// TODO Expand this to query a vocabulary file per character. 
export function findWordInContext(context: string, word: string): string { 
  const lowerWord = word.trim().toLowerCase(); // Normalize search word.
  const lines = context.split("\n"); // Split context into lines.
  let found = ""; // Store matched definition text.
  let collecting = false; // Track whether we are collecting multi-line definition.

  for (let i = 0; i < lines.length; i += 1) { // Loop over each line.
    const line = lines[i]; // Current line.
    const trimmed = line.trim(); // Trim whitespace.

    if (!collecting) { // If we are not yet collecting a definition.
      const match = trimmed.match(/^-?\s*\*\*(.+?)\*\*:\s*(.*)$/); // Match "**word**: definition".
      if (match) { // If the line matches the vocabulary pattern.
        const term = match[1].trim().toLowerCase(); // Extract and normalize the term.
        if (term === lowerWord) { // If term matches the requested word.
          found = match[2].trim(); // Start with the definition after the colon.
          collecting = true; // Start collecting following lines.
        }
      }
    } else { // We are collecting extra lines for this definition.
      if (trimmed.startsWith("- **") || trimmed.startsWith("**")) { // Next entry starts.
        break; // Stop collecting.
      }
      if (trimmed.length === 0) { // Empty line ends the block.
        break; // Stop collecting.
      }
      found += ` ${trimmed}`; // Append the continuation line.
    }
  }

  return found; // Return the found definition or empty string.
} 
