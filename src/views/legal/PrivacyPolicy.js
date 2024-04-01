import React from 'react'
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import '../main.css'

export default function PrivacyPolicy() {
  return (
    <>
    <Header />
    <div className='pageWrapper'>
        <h3>Privacy Policy</h3>
        <div className='FaqWrapper'>
        <h6>Last Updated 03/23/2024</h6>
            <br/>
            <h5>Introduction</h5>
            <p>Welcome to Resumancy ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and share information when you use our services, including the use of the ChatGPT API and Stripe for payment processing.</p>
            <br/>
            <h5>Information We Collect</h5>
            <h6>We may collect the following types of information:</h6>
            <ul>
                <li>
                    <h6>Personal Information:</h6>
                    <p>When you use our services, we may collect personal information you provide, such as your name, email address, and other contact details.</p>
                </li>
                <li>
                    <h6>Payment Information:</h6>
                    <p>When you make a payment, we collect payment-related information, including credit card details, billing address, and transaction information. This information is processed securely through Stripe.</p>
                </li>
                <li>
                    <h6>ChatGPT Data:</h6>
                    <p>When you use our AI resume builder, data generated during your interaction with the ChatGPT API may be collected to improve our services and customize your resume.</p>
                </li>
                <li>
                    <h6>Automatically Collected Information: </h6>
                    <p>We may collect information automatically, including usage data, IP addresses, browser type, and device information. We use cookies and similar technologies to collect this data.</p>
                </li>
            </ul>
            <br/>
            <h5>Use Of Information</h5>
            <h6>We use the information we collect for the following purposes:</h6>
            <ul>
                <li>To provide and improve our services, including customizing resumes using the ChatGPT API.</li>
                <li>To process payments securely through Stripe and fulfill transactions.</li>
                <li>To communicate with you, respond to inquiries, and provide customer support.</li>
                <li>To analyze and improve our services, including website performance and user experience.</li>
            </ul>
            <br/>
            <h5>Sharing of Information</h5>
            <h6>We may share your information as follows:</h6>
            <ul>
                <li>With third-party service providers, such as Stripe for payment processing. These providers have access to your data only as necessary to perform their functions and are obligated to maintain the confidentiality and security of your information.</li>
                <li>When required by law or to protect our rights, privacy, safety, or property, or that of our users or the public.</li>
                <li>With your consent, when you choose to share your resume or other information generated using our services.</li>
            </ul>
            <br/>
            <h5>Data Security</h5>
            <p>We implement reasonable security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
            <br/>
            <h5>Data Retention</h5>
            <p>We retain user data only as long as necessary for the purposes described in this Privacy Policy or as required by law.</p>
            <br/>
            <h5>User Rights</h5>
            <p>You have the right to access, rectify, or delete your data. For assistance with these rights or to make inquiries about your data, please contact us at <a href='mailto:Support@Resumancy.com'>Support@Resumancy.com</a>.</p>
            <br/>
            <h5>Cookies and Tracking</h5>
            <p>We use cookies and similar technologies to collect and track data. You can manage your cookie preferences through your browser settings.</p>
            <br/>
            <h5>Third-Party Services</h5>
            <p>Our services may include links or integrations with third-party services. These services have their own privacy policies, and we encourage you to review them.</p>
            <br/>
            <h5>Changes to Privacy Policy</h5>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes through our website or by other means. Your continued use of our services after the changes constitute your acceptance of the updated policy.</p>
            <br/>
            <h5>Contact Information</h5>
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href='mailto:Support@Resumancy.com'>Support@Resumancy.com</a>.</p>
        </div>
    </div>
    <Footer />
    </>
  )
}
