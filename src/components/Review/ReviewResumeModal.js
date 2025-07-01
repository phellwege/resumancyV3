import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import '../../views/main.css';
import { useUser } from '../../context/UserContext';
import EditResume from './editResume';
import ToggleStyle from './resumeStyles/ToggleStyle';
import Alert from 'react-bootstrap/Alert';
// import DefaultResumeStyle from './resumeStyles/defaultResumeStyle';
import ResumeStyle2 from './resumeStyles/resumeStyle2';
// import ResumeStyle3 from './resumeStyles/resumeStyle3';
import ResumeStyle4 from './resumeStyles/resumeStyle4';
import ResumeStyle5 from './resumeStyles/resumeStyle5';
import ResumeStyle6 from './resumeStyles/resumeStyle6';
import ResumePDFStyle2 from './resumeStyles/ResumePDFStyle2';
import ResumePDFStyle4 from './resumeStyles/ResumePDFStyle4';
import ResumePDFStyle5 from './resumeStyles/ResumePDFStyle5';
import ResumePDFStyle6 from './resumeStyles/ResumePDFStyle6';
import { useData } from '../../context/DataContext';
import { BsPhoneLandscape } from 'react-icons/bs';

const styleComponents = {
  // style1: DefaultResumeStyle,
  style2: ResumeStyle2,
  // style3: ResumeStyle3,
  style4: ResumeStyle4,
  style5: ResumeStyle5,
  style6: ResumeStyle6,
};

const pdfStyleComponents = {
  // style1: null, // No PDF component for style1 yet
  style2: ResumePDFStyle2,
  // style3: null, // No PDF component for style3 yet
  style4: ResumePDFStyle4,
  style5: ResumePDFStyle5,
  style6: ResumePDFStyle6,
};

export default function ReviewBaseResumeModal() {
  const { 
    reviewResumeModal, 
    handleCloseReviewResumeModal, 
    user,
    selectedResume
  } = useUser();
  const {
    updateSpecificResume
  } = useData();

  const [edit, setEdit] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('style2');
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [modalSize, setModalSize] = useState('lg');
  const [showOrientationAlert, setShowOrientationAlert] = useState(false);

  // Check if the screen is mobile size and orientation
  useEffect(() => {
    const checkIfMobile = () => {
      const mobileWidth = window.innerWidth < 768;
      const portrait = window.innerHeight > window.innerWidth;
      
      setIsMobile(mobileWidth);
      setIsPortrait(portrait);
      setModalSize(mobileWidth ? 'fullscreen' : 'lg');
      
      // Show orientation alert only on mobile in portrait mode
      setShowOrientationAlert(mobileWidth && portrait);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listeners for window resize and orientation change
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('orientationchange', checkIfMobile);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('orientationchange', checkIfMobile);
    };
  }, []);

  const updateResumeInFirebase = async () => {
    await updateSpecificResume(user.id, {
      id: selectedResume.id,
      firstName: user.firstName,
      lastName: user.lastName,
      contactInfo: {
          phone: user.contactInfo.phone,
          email: user.contactInfo.email,
      },
      summary: selectedResume.summary,
      experience: selectedResume.experience,
      education: selectedResume.education,
      skills: selectedResume.skills,
      // Include custom sections if they exist
      customSections: selectedResume.customSections || [],
      // For backward compatibility
      projects: selectedResume.projects || [],
  })};

  const SelectedResumeComponent = styleComponents[selectedStyle];
  const SelectedPDFComponent = pdfStyleComponents[selectedStyle];

  // Function to render PDF download link only when user and selectedResume are available
  const renderPDFDownloadLink = () => {
    if (!edit && SelectedPDFComponent && user && selectedResume) {
      return (
        <PDFDownloadLink
          document={<SelectedPDFComponent user={user} selectedResume={selectedResume} />}
          fileName={`${user.firstName}_${user.lastName}_Resume.pdf`}
          style={{
            textDecoration: 'none',
          }}
        >
          {({ loading, error }) => (
            <Button 
              aria-label="download pdf button" 
              disabled={loading}
            >
              {loading ? 'Generating PDF...' : 'Download'}
            </Button>
          )}
        </PDFDownloadLink>
      );
    }
    return null;
  };

  return (
    <>
      <Modal
        show={reviewResumeModal}
        onHide={() =>{
          handleCloseReviewResumeModal();
          setEdit(false);
        }}
        size={modalSize}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={true}
        scrollable={true}
        dialogClassName={isMobile ? "mobile-resume-modal" : ""}
      >
        <Modal.Header closeButton closeVariant="white">
          <div className={`reviewButton ${isMobile ? 'mobile-review-header' : ''}`}>
            <Modal.Title>Review Resume</Modal.Title>
            <div className={`reviewResumeStyleToggleButtonGroup ${isMobile ? 'mobile-toggle-group' : ''}`}>
                <ToggleStyle selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
                {renderPDFDownloadLink()}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className={`reviewSize ${isMobile ? 'mobile-review-body' : ''}`}>
          {showOrientationAlert && (
            <Alert variant="info" className="orientation-alert" onClose={() => setShowOrientationAlert(false)} dismissible>
              <div className="orientation-alert-content">
                <BsPhoneLandscape size={24} />
                <span>For a better viewing experience, rotate your device to landscape mode</span>
              </div>
            </Alert>
          )}
          
          {!edit ? (
            <div className={isMobile ? "mobile-resume-container" : ""}>
              <SelectedResumeComponent/>
            </div>
          ) : (
            <EditResume/>
          )}
        </Modal.Body>
        <Modal.Footer className={isMobile ? "mobile-resume-footer" : ""}>
          {
            edit ? (
              <Button variant="success" onClick={() => {
                setEdit(false);
                updateResumeInFirebase();
              }}>
                Save Changes
              </Button>
            ) : (
              <Button variant="warning" onClick={() => {
                setEdit(true);
              }}>
                Edit
              </Button>
            )
          }
          <Button variant="secondary" onClick={() => {
            handleCloseReviewResumeModal();
            setEdit(false)
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
