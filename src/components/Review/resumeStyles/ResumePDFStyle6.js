import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({ 
  page: {
    backgroundColor: 'white',
    color: 'black',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 8,
    lineHeight: 1.2,
  },
  header: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameAndTitle: {
    width: '50%',
  },
  contactInfo: {
    width: '50%',
    fontSize: 8,
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignSelf: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#8BC34A', 
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 12,
    marginBottom: 8,
    color: '#333',
    fontStyle: 'italic',
  },
  contactItem: {
    marginBottom: 2,
    color: '#333',
    marginLeft: 10,
  },
  contactLink: {
    color: '#333', 
    textDecoration: 'underline',
    fontSize: 8,
    marginBottom: 2,
    marginLeft: 10,
    alignSelf: 'center',
  },
  body: {
    flexDirection: 'row',
    marginTop: 10,
  },
  leftColumn: {
    width: '30%',
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  rightColumn: {
    width: '70%',
    paddingLeft: 15,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    color: '#009688', 
  },
  leftSectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    color: '#009688', 
  },
  sectionContent: {
    fontSize: 8,
    marginBottom: 2,
    lineHeight: 1.4,
    color: '#333',
  },
  experienceEntry: {
    marginBottom: 8,
  },
  experienceCompany: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  experienceJobTitle: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#333',
  },
  experienceTime: {
    fontSize: 8,
    textAlign: 'right',
    color: '#333',
  },
  projectEntry: {
    marginBottom: 5,
  },
  projectTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
    color: '#333',
  },
  link: {
    color: '#333', 
    textDecoration: 'underline',
    fontSize: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 8,
    fontSize: 8,
    color: '#333',
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    color: '#333',
  }
});

// Helper to render multi‑line text
const renderMultiline = (text, textStyle) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, index) => {
    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      return (
        <View key={index} style={styles.bulletItem}>
          <Text style={styles.bullet}>{line.trim().charAt(0)}</Text>
          <Text style={styles.bulletText}>{line.trim().substring(1)}</Text>
        </View>
      );
    }
    return (
      <Text key={index} style={textStyle}>
        {line}
      </Text>
    );
  });
};

const ResumePDFStyle6 = ({ user, selectedResume }) => {
  // Format the name
  const displayName = `${user.firstName?.charAt(0).toUpperCase() + user.firstName?.slice(1)} ${user.lastName?.charAt(0).toUpperCase() + user.lastName?.slice(1)}`;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header: Name, Job Title, Contact Info */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.nameAndTitle}>
              <Text style={styles.name}>{displayName}</Text>
              {user.jobTitle && <Text style={styles.jobTitle}>{user.jobTitle}</Text>}
            </View>
            <View style={styles.contactInfo}>
              {user.contactInfo?.email && (
                <Link src={`mailto:${user.contactInfo.email}`}>
                  <Text style={styles.contactLink}>{user.contactInfo.email}</Text>
                </Link>
              )}
              {user.contactInfo?.phone && (
                <Link src={`tel:${user.contactInfo.phone}`}>
                  <Text style={styles.contactLink}>{user.contactInfo.phone}</Text>
                </Link>
              )}
              {user.contactInfo?.socialMedia?.map((account, i) => (
                <Link key={i} src={account.url}>
                  <Text style={styles.contactLink}>{account.name}</Text>
                </Link>
              ))}
            </View>
          </View>
        </View>

        {/* Main body: two columns */}
        <View style={styles.body}>
          {/* LEFT COLUMN */}
          <View style={styles.leftColumn}>
            {/* ADDRESS - Optional */}
            {user.address?.useAddress && (
              <View style={styles.section}>
                <Text style={styles.leftSectionTitle}>ADDRESS</Text>
                <Text style={styles.sectionContent}>
                  {user.address.street ? `${user.address.street}, ` : ''}{user.address.city}, {user.address.state}{user.address.zip ? ` ${user.address.zip}` : ''}
                </Text>
              </View>
            )}
            
            {/* EDUCATION */}
            {selectedResume?.education && (
              <View style={styles.section}>
                <Text style={styles.leftSectionTitle}>EDUCATION</Text>
                {renderMultiline(selectedResume.education, styles.sectionContent)}
              </View>
            )}

            {/* SKILLS */}
            {selectedResume?.skills && (
              <View style={styles.section}>
                <Text style={styles.leftSectionTitle}>SKILLS</Text>
                {renderMultiline(selectedResume.skills, styles.sectionContent)}
              </View>
            )}
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.rightColumn}>
            {/* SUMMARY */}
            {selectedResume?.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SUMMARY</Text>
                {renderMultiline(selectedResume.summary, styles.sectionContent)}
              </View>
            )}

            {/* EMPLOYMENT / EXPERIENCE */}
            {selectedResume?.experience?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>EMPLOYMENT</Text>
                {selectedResume.experience.map((exp, index) => (
                  <View key={index} style={styles.experienceEntry}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.experienceCompany}>
                        {exp.expCompanyName} | {exp.expTime}
                      </Text>
                    </View>
                    <Text style={styles.experienceJobTitle}>
                      {exp.expJobTitle}
                    </Text>
                    {exp.expDesc && exp.expDesc.split('\n').map((line, i) => {
                      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                        return (
                          <View key={i} style={styles.bulletItem}>
                            <Text style={styles.bullet}>{line.trim().charAt(0)}</Text>
                            <Text style={styles.bulletText}>{line.trim().substring(1)}</Text>
                          </View>
                        );
                      }
                      return <Text key={i} style={styles.sectionContent}>{line}</Text>;
                    })}
                  </View>
                ))}
              </View>
            )}
            
            {/* Custom Sections */}
            {selectedResume?.customSections && selectedResume.customSections.map((section, sectionIndex) => (
              section.entries && section.entries.length > 0 && (
                <View key={`section-${sectionIndex}`} style={styles.section}>
                  <Text style={styles.sectionTitle}>{section.sectionName.toUpperCase()}</Text>
                  {section.entries.map((entry, entryIndex) => (
                    <View key={`entry-${sectionIndex}-${entryIndex}`} style={styles.projectEntry}>
                      <View style={styles.experienceHeader}>
                        <Text style={styles.experienceCompany}>{entry.title}</Text>
                        {entry.timeframe && <Text style={styles.experienceTime}>{entry.timeframe}</Text>}
                      </View>
                      {entry.subtitle && <Text style={{...styles.experienceJobTitle, marginBottom: 3}}>{entry.subtitle}</Text>}
                      {entry.description && renderMultiline(entry.description, styles.sectionContent)}
                    </View>
                  ))}
                </View>
              )
            ))}
            
            {/* Legacy Projects Section Support */}
            {!selectedResume?.customSections && selectedResume?.projects?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>PROJECTS</Text>
                {selectedResume.projects.map((proj, index) => (
                  <View key={index} style={styles.projectEntry}>
                    <Text style={styles.projectTitle}>{proj.title}</Text>
                    {renderMultiline(proj.description, styles.sectionContent)}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ResumePDFStyle6;
