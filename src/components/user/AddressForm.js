import React from 'react'
import { Form, Row, Col } from 'react-bootstrap';
import usStates from 'states-us';

import '../../views/main.css';
export default function AddressForm({ address, onChange}) {
    const handleChange = (key, value) => {
        onChange(key, value);
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
            onChange={(e) => {handleChange('city', e.target.value)}} 
            maxLength='50'
            />
        </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="addressState">
        <Form.Label column sm="2">State</Form.Label>
            <Col sm="5">
            <Form.Control as="select" onChange={(e) => {handleChange('state', e.target.value)}}>
                {usStates.map(state => (
                    <option key={state.name} value={state.abbr}>{state.name}</option>
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
            onChange={(e) => handleChange('zip', e.target.value)} 
            maxLength='50'
            />
        </Col>
        </Form.Group>
    </div>
  )
}
