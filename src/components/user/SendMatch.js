import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import stringSimilarity from 'string-similarity';

// Expanded stop words for better noise filtering
const stopWords = new Set([
  "the", "and", "with", "that", "this", "from", "for", "you", "your", "have",
  "has", "was", "were", "are", "can", "will", "not", "but", "they", "their",
  "which", "when", "what", "who", "how", "where", "why", "then", "than", "just",
  "only", "some", "any", "more", "most", "many", "other", "been", "does", "did",
  "would", "could", "should", "our", "we", "us", "a", "an", "in", "on", "at",
  "by", "as", "of", "or", "if", "it", "its", "into", "about", "over", "after",
  "before", "above", "below", "up", "down", "off", "out", "again", "further",
  "once", "youll", "work", "sector", "partner", "across", "role", "francisco", 
  "washington", "talk"
]);

// Refined Key Term Extraction using weighted frequency and capitalization bonus
const extractKeyTerms = (text, numKeywords = 30) => {
  const words = text
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word.toLowerCase()));

  const capitalizedBonus = 2;
  const wordScores = {};

  words.forEach(word => {
      const lowerWord = word.toLowerCase();
      const isCapitalized = /^[A-Z][a-z]+$/.test(word);
      const bonus = isCapitalized ? capitalizedBonus : 0;
      wordScores[lowerWord] = (wordScores[lowerWord] || 0) + 1 + bonus;
  });

  const sortedWords = Object.entries(wordScores).sort((a, b) => b[1] - a[1]);
  const topKeywords = sortedWords.slice(0, numKeywords).map(entry => entry[0]);
  return topKeywords;
};

// Expand extracted key terms using similarity matching with adjustable threshold
const expandKeywordsWithSimilarity = (keywords, allWords, threshold = 0.65) => {
  let expandedKeywords = new Set(keywords);

  keywords.forEach(keyword => {
      allWords.forEach(word => {
          if (stringSimilarity.compareTwoStrings(keyword, word) > threshold) {
              expandedKeywords.add(word);
          }
      });
  });

  return Array.from(expandedKeywords);
};

// Tokenize text into words
const tokenizeText = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3);
};

// Weighted similarity function remains unchanged
const weightedSimilarity = (resumeWords, jdWords) => {
  const normalizedJDWords = jdWords.map(word => word.toLowerCase());
  const normalizedResumeWords = resumeWords.map(word => word.toLowerCase());
  
  let matchScore = 0;
  const jdWordFreq = normalizedJDWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
  }, {});

  normalizedJDWords.forEach(jdWord => {
      if (normalizedResumeWords.includes(jdWord)) {
          const weight = 2;
          matchScore += jdWordFreq[jdWord] * weight;
      }
  });

  return matchScore / (normalizedJDWords.length || 1);
};

// Calculate match percentage using the refined methods and adjustable weights
export function calculateHybridMatchPercent(resumeText, jobDescriptionText) {
    // Adjustable weight constants
    const WEIGHT_JACCARD = 0.2;
    const WEIGHT_COSINE = 0.2;
    const WEIGHT_WEIGHTED = 0.45;
    const WEIGHT_KEYTERM = 0.2;
    const TECHNICAL_BONUS = 0.1;
    const COMPOSITE_MULTIPLIER = 3;

    const resumeTokens = tokenizeText(resumeText);
    const jdTokens = tokenizeText(jobDescriptionText);

    // Step 1: Extract high-priority terms with increased keyword count
    const resumeKeyTerms = extractKeyTerms(resumeText, 30);
    const jobDescKeyTerms = extractKeyTerms(jobDescriptionText, 30);

    // Step 2: Expand keywords (threshold can be tuned)
    const threshold = 0.65; 
    const expandedResumeTerms = expandKeywordsWithSimilarity(resumeKeyTerms, resumeTokens, threshold);
    const expandedJobDescTerms = expandKeywordsWithSimilarity(jobDescKeyTerms, jdTokens, threshold);

    const lowerExpandedResumeTerms = expandedResumeTerms.map(term => term.toLowerCase());
    const lowerExpandedJobDescTerms = expandedJobDescTerms.map(term => term.toLowerCase());

    // Prioritize key term matches
    const keyTermMatches = lowerExpandedResumeTerms.filter(word => lowerExpandedJobDescTerms.includes(word)).length;
    const keyTermWeight = expandedJobDescTerms.length ? (keyTermMatches / expandedJobDescTerms.length) : 0;

    // Jaccard Similarity
    const intersection = lowerExpandedResumeTerms.filter(word => lowerExpandedJobDescTerms.includes(word)).length;
    const union = new Set([...lowerExpandedResumeTerms, ...lowerExpandedJobDescTerms]).size;
    const jaccardScore = union === 0 ? 0 : intersection / union;

    // Cosine Similarity
    const termFrequency = (tokens) => tokens.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {});
    const resumeFreq = termFrequency(lowerExpandedResumeTerms);
    const jdFreq = termFrequency(lowerExpandedJobDescTerms);

    const allTokens = new Set([...Object.keys(resumeFreq), ...Object.keys(jdFreq)]);
    let dotProduct = 0, resumeMagnitude = 0, jdMagnitude = 0;

    allTokens.forEach(token => {
        const tfA = resumeFreq[token] || 0;
        const tfB = jdFreq[token] || 0;
        dotProduct += tfA * tfB;
        resumeMagnitude += tfA * tfA;
        jdMagnitude += tfB * tfB;
    });

    const cosineScore = (resumeMagnitude === 0 || jdMagnitude === 0) ? 0 : 
                          dotProduct / (Math.sqrt(resumeMagnitude) * Math.sqrt(jdMagnitude));

    // Weighted Keyword Similarity Boost
    const weightedScore = weightedSimilarity(expandedResumeTerms, expandedJobDescTerms);
    const technicalMatches = lowerExpandedResumeTerms.filter(word => lowerExpandedJobDescTerms.includes(word)).length;
    const technicalBonus = technicalMatches > 0 ? TECHNICAL_BONUS : 0;

    // Composite score combining the different metrics
    const compositeScore = (jaccardScore * WEIGHT_JACCARD) +
                           (cosineScore * WEIGHT_COSINE) +
                           (weightedScore * WEIGHT_WEIGHTED) +
                           (keyTermWeight * WEIGHT_KEYTERM);
    const adjustedScore = Math.min((compositeScore * COMPOSITE_MULTIPLIER) + technicalBonus, 1);
    const finalScore = Math.round(adjustedScore * 100);

    console.log("🔹 Resume Key Terms:", resumeKeyTerms);
    console.log("🔹 Job Description Key Terms:", jobDescKeyTerms);
    console.log("🔹 Expanded Resume Terms:", expandedResumeTerms);
    console.log("🔹 Expanded Job Description Terms:", expandedJobDescTerms);
    console.log("🔹 Jaccard Score:", jaccardScore);
    console.log("🔹 Cosine Score:", cosineScore);
    console.log("🔹 Weighted Score:", weightedScore);
    console.log("🔥 Final Match Score:", finalScore);
    return finalScore;
}

// Extract text from a resume object
export function extractResumeText(resume) {
    let textParts = [];
    if (Array.isArray(resume.experience)) {
        resume.experience.forEach(exp => {
            textParts.push(exp.expJobTitle || '', exp.expCompanyName || '', exp.expDesc || '');
        });
    }
    textParts.push(resume.education || '', resume.skills || '', resume.summary || '');
    return textParts.filter(part => part.trim().length > 0).join(' ');
}

// Match Calculation Component that updates Firebase via useData
const SendMatchResult = ({ tailoredResumeId, resume, jobDescription }) => {
    const { user, updateUserData } = useData();

    useEffect(() => {
        if (!user?.id || !resume || !jobDescription || !tailoredResumeId) return;

        const tailoredResume = user.tailoredResume.find(tr => tr.id === tailoredResumeId);
        if (!tailoredResume || !tailoredResume.summary || tailoredResume.experience.length === 0) return;

        const resumeText = extractResumeText(tailoredResume);

        (async () => {
            const matchPercent = calculateHybridMatchPercent(resumeText, jobDescription);
            const updatedTailoredResumes = user.tailoredResume.map(tr =>
                tr.id === tailoredResumeId
                    ? { ...tr, matchPercent, updatedAt: new Date().toISOString() }
                    : tr
            );
            // Push the updated resume data to Firebase
            updateUserData(user.id, { tailoredResume: updatedTailoredResumes });
        })();
    }, [user, resume, jobDescription, tailoredResumeId, updateUserData]);

    return null; // No UI rendering needed
};

export default SendMatchResult;
