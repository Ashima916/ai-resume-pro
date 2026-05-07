/**
 * Computes a simple ATS match score by comparing keywords in the
 * job description vs the resume JSON content.
 */
export function computeATS(resumeData, jobDescription) {
  if (!jobDescription || !resumeData) return { score: 0, matched: [], missing: [] };

  // Extract all words from job description (4+ chars, no common stop words)
  const stopWords = new Set(["with", "that", "this", "from", "have", "will", "your", "they", "their", "been", "also", "into", "more", "most", "some", "than", "then", "when", "which", "about", "would", "should", "could", "must"]);
  const jdText = jobDescription.toLowerCase();
  const jdWords = [...new Set(
    jdText.match(/\b[a-z][a-z+.#]{2,}\b/g) || []
  )].filter(w => !stopWords.has(w) && w.length >= 3);

  // Build resume text blob
  const resumeText = JSON.stringify(resumeData).toLowerCase();

  const matched = jdWords.filter(w => resumeText.includes(w)).slice(0, 20);
  const missing = jdWords.filter(w => !resumeText.includes(w)).slice(0, 12);

  const score = jdWords.length > 0
    ? Math.min(98, Math.round((matched.length / Math.min(jdWords.length, 30)) * 100))
    : 0;

  return { score, matched, missing };
}
