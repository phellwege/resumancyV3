import React from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useUser } from '../../context/UserContext';


import '../../views/main.css';
export default function SelectRecruiterAvatarModal() {
  const {
    user,
    userAvatars,
    handleSelectAvatar,
    selectRecruiterAvatar,
    handleCloseSelectRecruiterAvatar
  } = useUser();
  const history = useNavigate();
  return (
    <>
    <Modal 
    show={selectRecruiterAvatar} 
    onHide={handleCloseSelectRecruiterAvatar}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton>
            <Modal.Title>Select Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body id='avatarModalBody'>
        <div className="openAvatarWindow">
        {userAvatars.map((pic, picIndex) => (
          <div key={picIndex} className="modalAvatar">
            <div className="modalAvatarImg">
              <img src={pic} alt="avatarPicture" loading="lazy" />
            </div>
            <Button
              aria-label="select avatar button"
              onClick={() => {
                handleSelectAvatar(picIndex);
                handleCloseSelectRecruiterAvatar();
                history('/RecruiterSetupPage');
              }}
            >
              Select
            </Button>
          </div>
        ))}
    </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" 
            onClick={() => {
                handleCloseSelectRecruiterAvatar(); 
                history('/RecruiterSetupPage');
                }}
            >
                Back
            </Button>
            <Button variant="primary" 
            onClick={() => {
                handleCloseSelectRecruiterAvatar(); 
                history('/RecruiterSetupPage');
                }}
            >
                Continue
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
