import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default function ToggleStyle({ selectedStyle, onStyleChange }) {
  const handleSelectStyle = (style) => {
    onStyleChange(style);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {/* {selectedStyle === 'style1'
          ? 'Classic'
          : selectedStyle === 'style2'
          ? 'Modern'
          : selectedStyle === 'style3'
          ? 'Creative'
          : selectedStyle === 'style4'
          ? 'Professional'
          : 'Functional'} */}
          Resume Styles
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleSelectStyle('style2')}>Sleek Sophistication</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelectStyle('style1')}>Classic Resume</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelectStyle('style3')}>Professional Prodigy</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelectStyle('style4')}>Elegant Edge</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelectStyle('style5')}>Executive Excellence</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
