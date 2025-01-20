import React from 'react'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'

import '../main.css'
export default function FAQ() {
  return (
    <>
    <Header />
    <div className='pageWrapper'>
        <h3>Frequently Asked Questions</h3>
        <div className='FaqWrapper'>
        <br/>
        <ul>
            <li>
                <h5>What is an AI Resume Builder?</h5>
                <p>
                    An AI resume builder is a tool that uses artificial intelligence to analyze job descriptions and customize your resume for specific roles. It helps you create a targeted and compelling resume that increases your chances of landing the job you want.
                </p>
            </li>
            <li>
                <h5>How does the AI resume builder work?</h5>
                <p>
                    Our AI resume builder analyzes job descriptions and identifies key skills, qualifications, and keywords specific to the role. It then tailors your resume by emphasizing your relevant experience and skills, ensuring it matches the job requirements.
                </p>
            </li>
            <li>
                <h5>Is there a fee for using this AI resume builder?</h5>
                <p>
                We offer a free 7-day trial of the Basic Plan. The $5/month Basic Plan includes one base resume and up to five tailored resumes/cover letters per month. The $15/month Premium Plan provides unlimited tailored resumes/cover letters per month.
                </p>
            </li>
            <li>
                <h5>Is my data secure when using this tool?</h5>
                <p>
                    Yes, we take data security seriously. Your personal information and resume data are stored securely. We do not share your data with third parties.
                </p>
            </li>
            <li>
                <h5>Can I customize the resume further after AI-generated suggestions?</h5>
                <p>
                    Absolutely! While our AI provides tailored recommendations, you have full control over your resume. You can edit, add, or remove information as needed to make it uniquely yours.
                </p>
            </li>
            <li>
                <h5>What types of roles can I create resumes for using this tool?</h5>
                <p>
                    You can use our AI resume builder for a wide range of roles, from entry-level positions to executive roles. Simply provide the job description, and the tool will adapt accordingly.
                </p>
            </li>
            <li>
                <h5>Can I save multiple versions of my resume for different job applications?</h5>
                <p>
                    Yes, you can save multiple versions of your resume. This feature allows you to create customized resumes for various job opportunities and switch between them as needed.
                </p>
            </li>
            <li>
                <h5>Can I download my resume in different formats like PDF, ?</h5>
                <p>
                    Currently, you can only download your customized resume in PDF format, making it easy to share with employers.
                </p>
            </li>
            <li>
                <h5>Is there customer support available if I encounter any issues?</h5>
                <p>
                    Yes, we provide customer support to assist you with any questions or technical difficulties you may encounter while using our AI resume builder. Please allow up to 48 hours for a response. You can reach our support team at <a href='mailto:Support@Resumancy.com'>Support@Resumancy.com</a>
                </p>
            </li>
            <li>
                <h5>How can I get started with the AI resume builder?</h5>
                <p>
                    To get started, simply follow the prompts to input your information and the job description. Our AI will guide you through the process, helping you create a tailored resume in no time.
                </p>
            </li>
        </ul>
        </div>
    </div>
    <Footer />
    </>
  )
}
