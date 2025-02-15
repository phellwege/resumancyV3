// SendMatchResult.js

import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';

// Helper function: Extract resume text from a complex resume object.
export function extractResumeText(resume) {
  let textParts = [];
  
  // Concatenate text from experience entries
  if (Array.isArray(resume.experience)) {
    resume.experience.forEach(exp => {
      textParts.push(exp.expJobTitle, exp.expCompanyName, exp.expDesc);
    });
  }
  
  // Append additional fields
  textParts.push(resume.education, resume.skills, resume.additional, resume.summary);
  
  return textParts.filter(part => part && part.trim().length > 0).join(' ');
}

// Helper function: Calculate hybrid match percentage using Jaccard and Cosine similarity.
export function calculateHybridMatchPercent(resumeText, jobDescriptionText) {
  const stopwords = new Set([
    "a", "an", "the", "and", "or", "but", "if", "while", "with", "for", "on", "in", "at", "by", "to",
    "is", "are", "was", "were", "be", "been", "being", "of", "that", "this", "it"
  ]);

  // Helper: Tokenize the text and remove stopwords
  const tokenize = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word && !stopwords.has(word));
  };

  const resumeTokens = tokenize(resumeText);
  const jdTokens = tokenize(jobDescriptionText);

  // Jaccard similarity
  const resumeSet = new Set(resumeTokens);
  const jdSet = new Set(jdTokens);
  const intersection = new Set([...resumeSet].filter(word => jdSet.has(word)));
  const union = new Set([...resumeSet, ...jdSet]);
  const jaccardSimilarity = union.size === 0 ? 0 : (intersection.size / union.size);

  // Cosine similarity
  const createFreqMap = (tokens) =>
    tokens.reduce((map, token) => {
      map[token] = (map[token] || 0) + 1;
      return map;
    }, {});
  
  const resumeFreq = createFreqMap(resumeTokens);
  const jdFreq = createFreqMap(jdTokens);
  const allTokens = new Set([...Object.keys(resumeFreq), ...Object.keys(jdFreq)]);
  
  let dotProduct = 0;
  let resumeMagnitude = 0;
  let jdMagnitude = 0;
  
  allTokens.forEach(token => {
    const freqA = resumeFreq[token] || 0;
    const freqB = jdFreq[token] || 0;
    dotProduct += freqA * freqB;
    resumeMagnitude += freqA * freqA;
    jdMagnitude += freqB * freqB;
  });
  
  const cosineSimilarity = (resumeMagnitude === 0 || jdMagnitude === 0)
    ? 0
    : dotProduct / (Math.sqrt(resumeMagnitude) * Math.sqrt(jdMagnitude));
  
  const hybridScore = (jaccardSimilarity + cosineSimilarity) / 2;
  return Math.round(hybridScore * 100);
}

// Component: Calculates the match percentage and updates Firebase.
const SendMatchResult = ({ tailoredResumeId, resume, jobDescription }) => {
  const { user, updateUserData } = useData();

  useEffect(() => {
    // Only proceed if all required data is available.
    if (!user?.id || !resume || !jobDescription || !tailoredResumeId) return;

    // Extract resume text and calculate match percentage.
    const resumeText = extractResumeText(resume);
    const matchPercent = calculateHybridMatchPercent(resumeText, jobDescription);

    // Update the tailored resume entry with the calculated match percentage.
    const updatedTailoredResumes = user.tailoredResume.map(tr =>
      tr.id === tailoredResumeId
        ? { ...tr, matchPercent, updatedAt: new Date().toISOString() }
        : tr
    );
    updateUserData(user.id, { tailoredResume: updatedTailoredResumes });
  }, [user, resume, jobDescription, tailoredResumeId, updateUserData]);

  // This component does not render any UI.
  return null;
};

export default SendMatchResult;
