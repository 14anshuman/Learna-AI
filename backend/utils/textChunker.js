/**
 * Split text into chunks of a specified maximum size.
 * @param {string} text - The text to be chunked.
 * @param {number} maxChunkSize - The maximum size of each chunk.
 * @param {number} overlapSize - The number of overlapping characters between chunks.
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */
export const chunkText = (text, maxChunkSize = 5000, overlapSize = 50) => {
    if (!text || text.trim().length === 0) {
        return [];
    }

    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/\n /g, '\n')
        .trim();

    // FIX: correct regex split
    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = '';
    let chunkIndex = 0;
    let pageNumber = 0;

    for (const paragraph of paragraphs) {
        // If paragraph itself is larger than maxChunkSize
        if (paragraph.length > maxChunkSize) {
            // Flush existing chunk
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.trim(),
                    chunkIndex: chunkIndex++,
                    pageNumber,
                });
                currentChunk = '';
                pageNumber++;
            }

            // Split large paragraph with overlap
            let start = 0;
            while (start < paragraph.length) {
                const end = start + maxChunkSize;
                const chunkContent = paragraph.slice(start, end);

                chunks.push({
                    content: chunkContent.trim(),
                    chunkIndex: chunkIndex++,
                    pageNumber,
                });

                start += maxChunkSize - overlapSize;
                pageNumber++;
            }
        } 
        // Normal paragraph handling
        else {
            if ((currentChunk + '\n\n' + paragraph).length <= maxChunkSize) {
                currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
            } else {
                chunks.push({
                    content: currentChunk.trim(),
                    chunkIndex: chunkIndex++,
                    pageNumber,
                });

                currentChunk = paragraph;
                pageNumber++;
            }
        }
    }

    // Push remaining content
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.trim(),
            chunkIndex: chunkIndex++,
            pageNumber,
        });
    }

    return chunks;
};



/**
 * Find relevant chunks based on keyword matching (excluding stopwords).
 * @param {Array<{content: string, chunkIndex: number, pageNumber: number}>} chunks
 * @param {string | string[]} query
 * @param {number} minScore
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number, score: number}>}
 */
 const findRelevantChunks = (chunks, query, minScore = 1) => {
  if (!Array.isArray(chunks) || chunks.length === 0) return [];
  if (typeof query !== "string" || !query.trim()) return [];

//   console.log("hhee");
  
  // Normalize query
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .map(k => k.trim())
    .filter(k => k.length > 1 && !STOPWORDS.has(k));

  if (keywords.length === 0) return [];
//   console.log("KEYWORDS:", keywords);

  const results = [];

  for (const chunk of chunks) {
    if (!chunk || typeof chunk.content !== "string") continue;

    const contentLower = chunk.content.toLowerCase();
    let score = 0;

    for (const keyword of keywords) {
      const matches = contentLower.match(
        new RegExp(`\\b${keyword}\\b`, "g")
      );
      if (matches) score += matches.length;
    }

    if (score >= minScore) {
      results.push({ ...chunk, score });
    }
  }

//   console.log(results);
  
  return results.sort((a, b) => b.score - a.score);
};

const STOPWORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but',
    'is', 'are', 'was', 'were', 'be', 'been',
    'to', 'of', 'in', 'on', 'for', 'with',
    'as', 'by', 'at', 'from',
    'this', 'that', 'these', 'those',
    'it', 'its', 'they', 'them', 'their',
    'you', 'your', 'we', 'our',
    'can', 'could', 'should', 'would',
    'will', 'may', 'might',
]);


export default findRelevantChunks;