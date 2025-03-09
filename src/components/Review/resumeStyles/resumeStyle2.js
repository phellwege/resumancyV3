import React from 'react';
import { useUser } from '../../../context/UserContext';
import '../../../views/main.css';

export default function ResumeStyle2({ isGenPDF }) {
  const {
    user,
    stripFormatting,
    selectedResume
  } = useUser();

  const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const renderTextWithNewLines = (text) => {
    if (text) {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            const shouldIndent = line.startsWith('-');
            return (
                <p key={index} className={shouldIndent ? 'indented' : ''} style={{ marginBottom: "2px" }}>{line}
                </p>
            );
        });
    }
    return null;
};

  return (
    <>
    <div className='reviewHeight'>
        <div className='cardInnerDiv' id='resumeStyle2'>
        <div id='resumeStyle2Header'>
            <h3>
            {capitalizeFirstLetter(user?.firstName)}{" "}{isGenPDF && <span>&nbsp;</span>}{capitalizeFirstLetter(user?.lastName)}
            </h3>
            <h6>{user.jobTitle}</h6>
        </div>
        <div className='resumeStyleLowerWrap'>
            <div className='resumeStyleLeftBlock'>
            <div className='reviewDefaultResumeSections'>
                <h6>Contact Info:</h6>
                <a 
                    href={`mailto:${user.contactInfo.email}`}
                    target="_blank"
                >
                    {renderTextWithNewLines(user.contactInfo.email)}
                </a>
                <a
                    href={`tel:${stripFormatting(user.contactInfo.phone)}`}
                >
                    {renderTextWithNewLines(user.contactInfo.phone)}
                </a>
                {user.contactInfo.socialMedia.length > 0 && (
                    <div className='socialMediaLinks'>
                        {user.contactInfo.socialMedia.map((account, index) => (
                            <div key={index}>
                                <a 
                                    href={account.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {account.name}
                                </a>
                            </div>
                        ))}
                    </div>
                )}
                <br/>
                {user.address?.useAddress && (
                    <div className="reviewAddress">
                        <h6 className="mb-0">Address:</h6>
                        <p className="mb-1">
                            {user.address.street && `${user.address.street} `}
                            {user.address.appt && user.address.appt}
                            <br />
                            {user.address.city && `${user.address.city}`}
                            {user.address.state && `, ${user.address.state}`}
                            {user.address.zip && ` ${user.address.zip}`}
                        </p>
                    </div>
                )}
            </div>
            <div className='reviewDefaultResumeSections' id='lastReviewDefaultResumeSection'>
                <h6>Skills:</h6>
                <span className='leftOrientedReviewSections'>{renderTextWithNewLines(selectedResume?.skills)}</span>
                <div className='reviewDefaultResumeSections' id='resumeStyle2Education'>
                <h6>Education and Certifications:</h6>
                <span className='leftOrientedReviewSections'>{renderTextWithNewLines(selectedResume?.education)}</span>
            </div>
            </div>
            </div>
            <div className='resumeStyleRightBlock'>
                <div className='reviewDefaultResumeSections'>
                <h6>Summary:</h6>
                {renderTextWithNewLines(selectedResume?.summary)}
            </div>
            <div className='reviewDefaultResumeSections'>
                <h6>Experience:</h6>
                {selectedResume?.experience.map((exp, index) => (
                    <div key={index} className="experience-entry">
                        <h6 className='leftOrientedReviewSections spacing'>{renderTextWithNewLines(exp.expCompanyName)}</h6>
                        <div className='reviewResumeJobTitleAndTime'>
                            <h6 className='leftOrientedReviewSections'>{renderTextWithNewLines(exp.expJobTitle)}</h6>
                            <h6 className='leftOrientedReviewSections'>{renderTextWithNewLines(exp.expTime)}</h6>
                        </div>
                        <span className='leftOrientedReviewSections'>{renderTextWithNewLines(exp.expDesc)}</span>
                    </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    </div>
    </>
  )
}

// // ResumePDFStyle2.js
// import React from 'react';
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
// import { useUser } from '../../../context/UserContext';

// // Helper function to capitalize text.
// const capitalizeFirstLetter = (text) => {
//   if (!text) return '';
//   return text.charAt(0).toUpperCase() + text.slice(1);
// };

// // Helper to render multi‑line text with optional indent.
// const renderTextWithNewLines = (text, textStyle, indentStyle) => {
//     if (!text) return null;
//     const lines = text.split('\n');
//     return lines.map((line, index) => {
//       const styleToUse = line.startsWith('-') ? [textStyle, indentStyle] : textStyle;
//       return (
//         <Text key={index} style={styleToUse}>
//           {line}
//         </Text>
//       );
//     });
//   };
  

// const styles = StyleSheet.create({ 
//   page: {
//     backgroundColor: 'white',
//     color: 'black',
//     padding: 20,
//     fontFamily: 'Helvetica',
//     fontSize: 10,
//     lineHeight: 1.2,
//   },
//   header: {
//     borderBottomWidth: 2,
//     borderBottomColor: 'black',
//     marginBottom: 10,
//     paddingBottom: 5,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   jobTitle: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   container: {
//     flexDirection: 'row',
//   },
//   leftBlock: {
//     width: '25%',
//     backgroundColor: 'lightgray',
//     padding: 5,
//   },
//   rightBlock: {
//     width: '75%',
//     padding: 5,
//   },
//   section: {
//     marginBottom: 6,
//   },
//   sectionTitle: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     marginBottom: 2,
//   },
//   sectionContent: {
//     fontSize: 9,
//     marginBottom: 2,
//   },
//   indent: {
//     marginLeft: 10,
//   },
//   experienceEntry: {
//     marginBottom: 4,
//   },
// });

// const ResumePDFStyle2 = () => {
//   // Get user and selectedResume directly from your context.
//   const { user, selectedResume } = useUser();

//   return (
//     <Document>
//       <Page size="LETTER" style={styles.page}>
//         {/* Header: Name and Job Title */}
//         <View style={styles.header}>
//           <Text style={styles.name}>
//             {capitalizeFirstLetter(user?.firstName)} {capitalizeFirstLetter(user?.lastName)}
//           </Text>
//           <Text style={styles.jobTitle}>{user.jobTitle}</Text>
//         </View>

//         {/* Two‑column layout */}
//         <View style={styles.container}>
//           {/* Left Block: Contact Info, Skills, Education */}
//           <View style={styles.leftBlock}>
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Contact Info:</Text>
//               <Text style={styles.sectionContent}>Email: {user.contactInfo.email}</Text>
//               <Text style={styles.sectionContent}>Phone: {user.contactInfo.phone}</Text>
//               {user.contactInfo.socialMedia &&
//                 user.contactInfo.socialMedia.map((account, index) => (
//                   <Text key={index} style={styles.sectionContent}>
//                     {account.name}: {account.url}
//                   </Text>
//                 ))}
//               {user.address?.useAddress && (
//                 <View style={styles.section}>
//                   <Text style={styles.sectionTitle}>Address:</Text>
//                   <Text style={styles.sectionContent}>
//                     {user.address.street} {user.address.appt}
//                   </Text>
//                   <Text style={styles.sectionContent}>
//                     {user.address.city}, {user.address.state} {user.address.zip}
//                   </Text>
//                 </View>
//               )}
//             </View>
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Skills:</Text>
//               {renderTextWithNewLines(selectedResume?.skills, styles.sectionContent, styles.indent)}
//             </View>
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Education and Certifications:</Text>
//               {renderTextWithNewLines(selectedResume?.education, styles.sectionContent, styles.indent)}
//             </View>
//           </View>

//           {/* Right Block: Summary, Experience */}
//           <View style={styles.rightBlock}>
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Summary:</Text>
//               {renderTextWithNewLines(selectedResume?.summary, styles.sectionContent, styles.indent)}
//             </View>
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Experience:</Text>
//               {selectedResume?.experience &&
//                 selectedResume.experience.map((exp, index) => (
//                   <View key={index} style={styles.experienceEntry}>
//                     <Text style={[styles.sectionContent, { fontWeight: 'bold' }]}>
//                       {renderTextWithNewLines(exp.expCompanyName, styles.sectionContent, styles.indent)}
//                     </Text>
//                     <Text style={styles.sectionContent}>
//                       {renderTextWithNewLines(exp.expJobTitle, styles.sectionContent, styles.indent)}{' '}
//                       ({renderTextWithNewLines(exp.expTime, styles.sectionContent, styles.indent)})
//                     </Text>
//                     <View style={styles.indent}>
//                       {renderTextWithNewLines(exp.expDesc, styles.sectionContent, styles.indent)}
//                     </View>
//                   </View>
//                 ))}
//             </View>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default ResumePDFStyle2;
