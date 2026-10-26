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
            <h6>Last Updated 10/26/2026</h6>
            <br/>
            <h5>Short version</h5>
            <p>
                Resumancy is a static web page with no server, no database, no accounts, no analytics and no cookies.
                We do not collect, receive or store any of your information.
            </p>
            <br/>
            <h5>What stays in your browser</h5>
            <p>
                Your profile, resumes, cover letters, theme and model choice are saved in your own browser's local storage
                so they are there when you come back. Your OpenAI API key is kept in memory for the open tab, and is saved
                in local storage only if you tick "Remember the key on this device". You can export or delete all of it
                from the Data &amp; Settings page, or by clearing this site's data in your browser.
            </p>
            <br/>
            <h5>What goes to OpenAI</h5>
            <p>
                When you generate a resume, tailored resume, cover letter or gap analysis, your browser sends the relevant
                resume details and job description directly to OpenAI (api.openai.com) using your own API key. That data is
                handled under OpenAI's API terms and privacy policy, not ours. Nothing passes through us.
            </p>
            <br/>
            <h5>Hosting</h5>
            <p>
                The page files are served by GitHub Pages. GitHub may keep standard web server logs (such as IP addresses)
                under its own privacy statement.
            </p>
            <br/>
            <h5>Changes</h5>
            <p>If this policy changes, the date at the top will change with it.</p>
        </div>
    </div>
    <Footer />
    </>
  )
}
