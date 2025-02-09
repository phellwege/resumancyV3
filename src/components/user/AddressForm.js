import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import usStates from 'states-us';
import { useUser } from '../../context/UserContext';

import '../../views/main.css';
export default function AddressForm() {
    const {
        user,
        handleAddressChange
    } = useUser();

    const handleChange = (key, value) => {
        handleAddressChange(key, value);
      };

  return (
    <div className='addressForm'>
        <sub>Address Info is Optional</sub>
        <Form.Group 
        as={Row} 
        controlId="addressStreet"
        >
        <Form.Label column sm="2">Street</Form.Label>
        <Col sm="10">
            <Form.Control 
            type="text" 
            placeholder="Street Address"
            value={user?.address?.street || ''}
            onChange={(e) => {handleChange('street', e.target.value)}} 
            maxLength='50'
            />
        </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="addressCity">
        <Form.Label column sm="2">City</Form.Label>
        <Col sm="7">
            <Form.Control 
            type="text" 
            placeholder="City"
            value={user?.address?.city || ''}
            onChange={(e) => {handleChange('city', e.target.value)}} 
            maxLength='50'
            />
        </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="addressState">
        <Form.Label column sm="2">State</Form.Label>
            <Col sm="5">
            <Form.Control 
            as="select" 
            value={user?.address?.state || ''}
            onChange={(e) => {handleChange('state', e.target.value)}}
            >
                <option value="">Select a state</option>
                {usStates.map(state => (
                    <option 
                        key={state.name} 
                        value={state.abbr}
                    >
                        {state.name}
                    </option>
                ))}
            </Form.Control>
            </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="addressZip">
        <Form.Label column sm="2">ZIP</Form.Label>
        <Col sm="5">
            <Form.Control 
            type="text" 
            placeholder="ZIP"
            value={user?.address?.zip || ''}
            onChange={(e) => handleChange('zip', e.target.value)} 
            maxLength='50'
            />
        </Col>
        </Form.Group>
    </div>
  )
}
