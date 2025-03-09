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
    padding: 30,
    paddingBottom: 5,
    textAlign: 'center',
  },
  headerLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginTop: 5,
    marginHorizontal: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 12,
    marginBottom: 5,
  },
  container: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  leftBlock: {
    width: '25%',
    backgroundColor: '#e0e0e0',
    padding: 15,
    paddingTop: 10,
  },
  rightBlock: {
    width: '75%',
    padding: 15,
    paddingTop: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    color: 'black',
  },
  leftSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    color: 'black',
  },
  sectionContent: {
    fontSize: 8,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  leftSectionContent: {
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

const ResumePDFStyle2 = ({ user, selectedResume }) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header: Name and Job Title */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {capitalizeFirstLetter(user?.firstName)} {capitalizeFirstLetter(user?.lastName)}
          </Text>
          <View style={{height: 10}} />
          <Text style={styles.jobTitle}>{user.jobTitle}</Text>
        </View>
        <View style={styles.headerLine} />

        {/* Two‑column layout */}
        <View style={styles.container}>
          {/* Left Block: Contact Info, Skills, Education */}
          <View style={styles.leftBlock}>
            <View style={styles.section}>
              <Text style={styles.leftSectionTitle}>CONTACT INFO</Text>
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
                <Text style={styles.leftSectionTitle}>ADDRESS</Text>
                <Text style={styles.leftSectionContent}>
                  {user.address.city}, {user.address.state}
                </Text>
              </View>
            )}
            
            <View style={styles.section}>
              <Text style={styles.leftSectionTitle}>SKILLS</Text>
              {selectedResume?.skills && selectedResume.skills.split('\n').map((line, i) => {
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <View key={i} style={styles.bulletItem}>
                      <Text style={styles.bullet}>{line.trim().charAt(0)}</Text>
                      <Text style={styles.bulletText}>{line.trim().substring(1)}</Text>
                    </View>
                  );
                }
                return <Text key={i} style={styles.leftSectionContent}>{line}</Text>;
              })}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.leftSectionTitle}>EDUCATION AND CERTIFICATIONS</Text>
              {selectedResume?.education && selectedResume.education.split('\n').map((line, i) => {
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <View key={i} style={styles.bulletItem}>
                      <Text style={styles.bullet}>{line.trim().charAt(0)}</Text>
                      <Text style={styles.bulletText}>{line.trim().substring(1)}</Text>
                    </View>
                  );
                }
                return <Text key={i} style={styles.leftSectionContent}>{line}</Text>;
              })}
            </View>
          </View>

          {/* Right Block: Summary, Experience */}
          <View style={styles.rightBlock}>
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
        </View>
      </Page>
    </Document>
  );
};

export default ResumePDFStyle2;
