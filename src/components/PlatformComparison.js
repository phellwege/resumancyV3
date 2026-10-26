import React from 'react';
import { useMediaQuery } from 'react-responsive';

const PlatformComparison = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isPortrait = useMediaQuery({ orientation: 'portrait' });

  return (
    <div className="comparisonTableWrapper" style={{ 
      overflowX: 'auto',
      margin: '0 auto',
      maxWidth: '100%',
      padding: isMobile ? '0.5rem' : '1rem'
    }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '1rem',
        fontSize: isMobile ? '1.2rem' : '1.5rem'
      }}>
        Why Choose Resumancy?
      </h3>
      <p style={{ 
        textAlign: 'center', 
        maxWidth: '700px', 
        margin: '0 auto 1.5rem',
        fontSize: isMobile ? '0.9rem' : '1rem',
        padding: isMobile ? '0 0.5rem' : '0'
      }}>
        Most resume tools focus on layout. Resumancy helps you improve your actual content — tailored to each job.
      </p>
      
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        fontSize: isMobile ? '0.85rem' : isTablet ? '0.75rem' : '0.95rem',
        minWidth: isMobile ? '500px' : '100%' // Ensures horizontal scrolling on mobile
      }}>
        <thead>
          <tr style={{ backgroundColor: '#1b2735', color: '#ffffff' }}>
            <th style={{...thStyle, width: isMobile ? '120px' : '200px'}}></th>
            <th style={{...thStyle, width: isMobile ? '80px' : '120px'}}>Resumancy</th>
            <th style={{...thStyle, width: isMobile ? '80px' : '120px'}}>Free Resume Builders</th>
            <th style={{...thStyle, width: isMobile ? '80px' : '120px'}}>Generic Templates</th>
            <th style={{...thStyle, width: isMobile ? '80px' : '120px'}}>Traditional Editors</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, resumancy, free, template, editor]) => (
            <tr key={label} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{...tdLabelStyle, padding: isMobile ? '0.5rem 0.25rem' : '0.25rem 0.5rem'}}>{label}</td>
              <td style={{...tdStyle, padding: isMobile ? '0.5rem 0.25rem' : '0.25rem 0.5rem'}}>{resumancy}</td>
              <td style={{...tdStyle, padding: isMobile ? '0.5rem 0.25rem' : '0.25rem 0.5rem'}}>{free}</td>
              <td style={{...tdStyle, padding: isMobile ? '0.5rem 0.25rem' : '0.25rem 0.5rem'}}>{template}</td>
              <td style={{...tdStyle, padding: isMobile ? '0.5rem 0.25rem' : '0.25rem 0.5rem'}}>{editor}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {(isMobile && isPortrait) && (
        <p style={{ 
          textAlign: 'center', 
          fontSize: '0.7rem', 
          color: '#666', 
          marginTop: '0.25rem' 
        }}>
          ← Swipe to see more →
        </p>
      )}
    </div>
  );
};

const thStyle = {
  padding: '0.25rem',
  borderBottom: '2px solid #ccc',
  textAlign: 'center',
};

const tdStyle = {
  padding: '0.25rem',
  textAlign: 'center',
};

const tdLabelStyle = {
  padding: '0.25rem',
  fontWeight: 'bold',
  textAlign: 'left',
};

const rows = [
  ['Tailors resume to job description', '✅', '❌', '❌', '❌'],
  ['Match % scoring', '✅', '❌', '❌', '❌'],
  ['Skill gap insights', '✅', '❌', '❌', '❌'],
  ['AI-generated cover letters', '✅', '❌', '❌', '❌'],
  ['Editable templates', '✅', '✅', '✅', '✅'],
  ['PDF export', '✅', '✅', '✅', '✅'],
  ['Pricing', 'Free (your own OpenAI key)', 'Free', 'Free', 'Free'],
  ['Improves application success', '✅', '⚠️', '❌', '❌'],
  ['No editing/prompting skills required', '✅', '❌', '❌', '⚠️'],
];

export default PlatformComparison;
