import React from "react";
import { Container } from "react-bootstrap";

import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import './main.css';
import CreateCustomTailoredResume from "../components/ResumeCreationComponents/CreateCustomTailoredResume";

export default function Tailor() {
  return (
    <>
    <Header />
    <Container fluid className="mobile-view-container">
      <CreateCustomTailoredResume />
    </Container>
    <Footer />
    </>
  )
}
