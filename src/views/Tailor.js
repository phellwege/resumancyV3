import React from "react";

import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'

import './main.css';
import CreateCustomTailoredResume from "../components/ResumeCreationComponents/CreateCustomTailoredResume";
export default function Tailor() {

  return (
    <>
    <Header />
    <CreateCustomTailoredResume />
    <Footer />
    </>
  )
}
