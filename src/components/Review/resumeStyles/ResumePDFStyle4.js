import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Helper function to capitalize text.
const capitalizeFirstLetter = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Helper to render multi‑line text with optional indent.
const renderTextWithNewLines = (text, textStyle, indentStyle) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const styleToUse = line.startsWith('-') || line.startsWith('•') ? [textStyle, indentStyle] : textStyle;
    return (
      <Text key={index} style={styleToUse}>
        {line}
      </Text>
    );
  });
};

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    color: 'black',
    padding: 0,
    fontFamily: 'Helvetica',
    fontSize: 8,
    lineHeight: 1.2,
  },
  header: {
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#7AA1CB',
    padding: 15,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: 'black',
  },
  jobTitle: {
    fontSize: 12,
    marginBottom: 5,
    color: 'black',
  },
  container: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  leftBlock: {
    width: '70%',
    paddingRight: 10,
    paddingLeft: 15,
    paddingTop: 10,
  },
  rightBlock: {
    width: '30%',
    backgroundColor: '#e0e0e0',
    height: '100%',
    paddingLeft: 15,
    paddingTop: 10,
    paddingRight: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    color: '#7AA1CB',
  },
  rightSectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    color: '#7AA1CB',
  },
  sectionContent: {
    fontSize: 8,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  rightSectionContent: {
    fontSize: 8,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  indent: {
    marginLeft: 10,
  },
  experienceEntry: {
    marginBottom: 8,
  },
  experienceCompany: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  experienceJobTitle: {
    fontSize: 9,
    fontStyle: 'italic',
  },
  experienceTime: {
    fontSize: 8,
    textAlign: 'right',
  },
  link: {
    color: '#0000FF',
    textDecoration: 'underline',
    fontSize: 8,
    marginBottom: 3,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 8,
    fontSize: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
  }
});

const ResumePDFStyle4 = ({ user, selectedResume }) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header: Name and Job Title */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {capitalizeFirstLetter(user?.firstName)} {capitalizeFirstLetter(user?.lastName)}
          </Text>
          <Text style={styles.jobTitle}>{user.jobTitle}</Text>
        </View>

        {/* Two‑column layout */}
        <View style={styles.container}>
          {/* Left Block: Summary, Experience */}
          <View style={styles.leftBlock}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SUMMARY</Text>
              {renderTextWithNewLines(selectedResume?.summary, styles.sectionContent, styles.indent)}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EXPERIENCE</Text>
              {selectedResume?.experience &&
                selectedResume.experience.map((exp, index) => (
                  <View key={index} style={styles.experienceEntry}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.experienceCompany}>
                        {exp.expCompanyName}
                      </Text>
                      <Text style={styles.experienceTime}>{exp.expTime}</Text>
                    </View>
                    <Text style={styles.experienceJobTitle}>{exp.expJobTitle}</Text>
                    <View style={styles.indent}>
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
                  </View>
                ))}
            </View>
          </View>

          {/* Right Block: Contact Info, Skills, Education */}
          <View style={styles.rightBlock}>
            <View style={styles.section}>
              <Text style={styles.rightSectionTitle}>CONTACT INFO</Text>
              <Link src={`mailto:${user.contactInfo.email}`}>
                <Text style={styles.link}>{user.contactInfo.email}</Text>
              </Link>
              <Link src={`tel:${user.contactInfo.phone}`}>
                <Text style={styles.link}>{user.contactInfo.phone}</Text>
              </Link>
              {user.contactInfo.socialMedia && user.contactInfo.socialMedia.length > 0 &&
                user.contactInfo.socialMedia.map((account, index) => (
                  <Link key={index} src={account.url}>
                    <Text style={styles.link}>{account.name}</Text>
                  </Link>
                ))}
            </View>
            
            {user.address?.useAddress && (
              <View style={styles.section}>
                <Text style={styles.rightSectionTitle}>ADDRESS</Text>
                <Text style={styles.rightSectionContent}>
                  {user.address.street ? `${user.address.street}, ` : ''}{user.address.city}, {user.address.state}{user.address.zip ? ` ${user.address.zip}` : ''}
                </Text>
              </View>
            )}
            
            <View style={styles.section}>
              <Text style={styles.rightSectionTitle}>SKILLS</Text>
              {selectedResume?.skills && selectedResume.skills.split('\n').map((line, i) => {
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <View key={i} style={styles.bulletItem}>
                      <Text style={styles.bullet}>{line.trim().charAt(0)}</Text>
                      <Text style={styles.bulletText}>{line.trim().substring(1)}</Text>
                    </View>
                  );
                }
                return <Text key={i} style={styles.rightSectionContent}>{line}</Text>;
              })}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.rightSectionTitle}>EDUCATION</Text>
              {selectedResume?.education && selectedResume.education.split('\n').map((line, i) => {
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <View key={i} style={styles.bulletItem}>
                      <Text style={styles.bullet}>{line.trim().charAt(0)}</Text>
                      <Text style={styles.bulletText}>{line.trim().substring(1)}</Text>
                    </View>
                  );
                }
                return <Text key={i} style={styles.rightSectionContent}>{line}</Text>;
              })}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ResumePDFStyle4;
