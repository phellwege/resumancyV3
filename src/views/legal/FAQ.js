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
                <h4>What is an AI Resume Builder?</h4>
                <p>
                    An AI resume builder is a tool that uses artificial intelligence to analyze job descriptions and customize your resume for specific roles. It helps you create a targeted and compelling resume that increases your chances of landing the job you want.
                </p>
            </li>
            <li>
                <h4>How does the AI resume builder work?</h4>
                <p>
                    Our AI resume builder analyzes job descriptions and identifies key skills, qualifications, and keywords specific to the role. It then tailors your resume by emphasizing your relevant experience and skills, ensuring it matches the job requirements.
                </p>
            </li>
            <li>
                <h4>Do I need any special skills to use this tool?</h4>
                <p>
                    No, you don't need any special skills. Our AI resume builder is designed to be intuitive and straightforward, making it accessible to users of all skill levels.
                </p>
            </li>
            <li>
                <h4>Is my data secure when using this tool?</h4>
                <p>
                    Yes, we take data security seriously. Your personal information and resume data are encrypted and stored securely. We do not share your data with third parties.
                </p>
            </li>
            <li>
                <h4>Can I customize the resume further after AI-generated suggestions?</h4>
                <p>
                    Absolutely! While our AI provides tailored recommendations, you have full control over your resume. You can edit, add, or remove information as needed to make it uniquely yours.
                </p>
            </li>
            <li>
                <h4>What types of roles can I create resumes for using this tool?</h4>
                <p>
                    You can use our AI resume builder for a wide range of roles, from entry-level positions to executive roles. Simply provide the job description, and the tool will adapt accordingly.
                </p>
            </li>
            <li>
                <h4>Can I save multiple versions of my resume for different job applications?</h4>
                <p>
                    Yes, you can save multiple versions of your resume. This feature allows you to create customized resumes for various job opportunities and switch between them as needed.
                </p>
            </li>
            <li>
                <h4>Is there a fee for using this AI resume builder?</h4>
                <p>
                    We offer both free and a premium version ($5/mo, or $50/yr) of our tool. The free version provides basic functionality, while the premium version offers more advanced features and additional customization options.
                </p>
            </li>
            <li>
                <h4>Can I download my resume in different formats (e.g., PDF, Word)?</h4>
                <p>
                    Currently, you can only download your customized resume in PDF format, making it easy to share with employers.
                </p>
            </li>
            <li>
                <h4>Is there customer support available if I encounter any issues?</h4>
                <p>
                    Yes, we provide customer support to assist you with any questions or technical difficulties you may encounter while using our AI resume builder. You can reach our support team through <a href='mailto:Support@Resumancy.com'>Support@Resumancy.com</a>
                </p>
            </li>
            <li>
                <h4>How can I get started with the AI resume builder?</h4>
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
