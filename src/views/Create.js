import React from 'react'
import { Container } from "react-bootstrap";

import Footer from '../components/footer/Footer'
import Header from '../components/header/Header'
import CreateBaselineResume from '../components/ResumeCreationComponents/CreateBaselineResume'

export default function Create() {
  return (
    <>
      <Header />
      <Container fluid className="mobile-view-container">
        <CreateBaselineResume />
      </Container>
      <Footer />
    </>
  )
}
