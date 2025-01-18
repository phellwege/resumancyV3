import React from 'react'
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useUser } from '../../context/UserContext';


import '../../views/main.css';
export default function UserSetupModal() {
  const {
    user,
    userAvatars,
    handleSelectAvatar,
    selectAvatar,
    handleCloseSelectAvatar,
    handleOpenSetupUserModal
  } = useUser();

  return (
    <>
    <Modal 
    show={selectAvatar} 
    onHide={handleCloseSelectAvatar}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton  closeVariant='white'>
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
                handleCloseSelectAvatar();
                handleOpenSetupUserModal();
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
                handleCloseSelectAvatar(); 
                handleOpenSetupUserModal()
                }}
            >
                Back
            </Button>
            <Button variant="primary" 
            onClick={() => {
                handleCloseSelectAvatar(); 
                handleOpenSetupUserModal()
                }}
            >
                Continue
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
