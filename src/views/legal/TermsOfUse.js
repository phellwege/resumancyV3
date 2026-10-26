import React from 'react'
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { Link } from 'react-router-dom';
import '../main.css'
export default function TermsOfUse() {
  return (
    <>
    <Header />
    <div className='pageWrapper'>
    <h3>Terms of Service</h3>
        <div className='FaqWrapper'>
            <h5>Introduction</h5>
            <p>Last Updated: 10/26/2026</p>
            <p>
                Please read these Terms of Use ("Terms") carefully before using Resumancy ("Services") operated by CrimsonScan LLC ("us," "we," or "our").
                <br/>
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, please do not use the Service.
            </p>
            <br/>
            <h5>Use of the Service</h5>
            <ul>
                <li>
                    <h6>Eligibility</h6>
                    <p>You must be at least 13 years old to use this Service.</p>
                </li>
                <li>
                    <h6>Access</h6>
                    <p>We grant you a limited, non-exclusive, non-transferable, and revocable license to use the Service for personal and non-commercial purposes only.</p>
                </li>
                <li>
                    <h6>Your OpenAI API key</h6>
                    <p>The Service has no accounts. To generate content you supply your own OpenAI API key. Requests are sent from your browser directly to OpenAI under your key, you are responsible for its use and any charges OpenAI bills to you, and your use of OpenAI is subject to OpenAI's own terms.</p>
                </li>
            </ul>
            <br/>
            <h5>User Content</h5>
            <h6>User Responsibly</h6>
            <p>You are solely responsible for the information, data, and content you provide or upload when using the Services ("User Content"). You represent and warrant that your User Content does not violate any third-party rights or applicable laws.</p>
            <br/>
            <h6>License</h6>
            <p>By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free, and sublicensable license to use, reproduce, adapt, publish, translate, distribute, and display your User Content for the purpose of providing the Service.</p>
            <br/>
            <h5>Prohibited Conduct</h5>
            <h6>You agree not to:</h6>
            <ul>
                <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations.</li>
                <li>Attempt to access any portion of the Service that you are not authorized to use.</li>
                <li>Interfere with or disrupt the Service, its servers, or networks.</li>
                <li>Use any automated means, including robots, spiders, or crawlers, to access the Service.</li>
                <li>Upload or transmit malicious code or any content that may harm the Service or other users.</li>
            </ul>
            <br/>
            <h6>Privacy</h6>
            <p>Your use of the Service is also governed by our Privacy Policy, which can be found at <Link to='/PrivacyPolicy'>[Link to Privacy Policy]</Link>. By using the Service, you consent to the collection and use of your personal information as described in the Privacy Policy.</p>
            <br/>
            <h5>Intellectual Property</h5>
            <h6>Ownership</h6>
            <p>The Service and its content, including but not limited to text, graphics, logos, and software, are owned by Resumancy and are protected by copyright, trademark, and other intellectual property laws.</p>
            <h6>License</h6>
            <p>We grant you a limited, non-exclusive, and non-transferable license to access and use the Service for its intended purposes. You may not modify, reproduce, distribute, or create derivative works from the Service without our express written consent.</p>
            <br/>
            <h6>Termination</h6>
            <p>We may terminate or suspend your access to the Service, without prior notice or liability, for any reason, including without limitation if you breach these Terms.</p>
            <br/>
            <h6>Disclaimer</h6>
            <p>The Service is an unsupported demo provided on an "as-is" and "as-available" basis. AI-generated content can be inaccurate; review everything before you use it. We make no warranties, either express or implied, regarding the accuracy, reliability, or availability of the Service.</p>
            <br/>
            <h6>Limitation of Liability</h6>
            <p>To the fullest extent permitted by applicable law, Resumancy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or inability to use the Service; (b) any unauthorized access to or use of our servers and/or any personal information stored therein; (c) any interruption or cessation of the Service; (d) any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service by any third party.</p>
            <br/>
            <h6>Governing Law</h6>
            <p>These Terms shall be governed and construed in accordance with the laws of the State of Idaho, United States, without regard to its conflict of law provisions.</p>
            <br/>
            <h6>Changes to These Terms</h6>
            <p>We reserve the right to modify these Terms at any time. You are responsible for regularly reviewing these Terms. Continued use of the Service after any such changes shall constitute your consent to such changes.</p>
            <br/>
            <h6>Contact Us</h6>
            <p>If you have any questions about these Terms, open an issue on the project's <a href='https://github.com/phellwege/resumancyV3' target='_blank' rel='noopener noreferrer'>GitHub repository</a>.</p>
        </div>
    </div>
    <Footer />
    </>
  )
}
