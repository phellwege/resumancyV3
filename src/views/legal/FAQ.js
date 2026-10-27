import React from 'react'
import { Helmet } from 'react-helmet'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import '../main.css'

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Resumancy - AI Resume Builder</title>
        <meta name="description" content="Get answers to common questions about Resumancy's AI resume builder, cover letter generator, skill gap analysis, bring-your-own-key setup, and more." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What services does Resumancy offer?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We specialize in AI-driven résumé and cover letter creation. We enhance your base résumé, tailor it to specific job postings, provide a skill gap analysis, generate match percentages for quick insight on alignment, and offer multiple résumé templates. Our goal is to make job applications easier and more effective."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is an AI résumé builder?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An AI résumé builder is a tool that uses artificial intelligence to analyze job descriptions and customize your résumé for specific roles. It helps you create a targeted and compelling résumé that increases your chances of landing the job you want."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is there a fee for using your service?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Resumancy is a free demo. You bring your own OpenAI API key, so the only cost is your own OpenAI usage, typically a few cents per tailored résumé with a small model."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      <Header />
      <main className='pageWrapper'>
        <h1>Frequently Asked Questions</h1>
        <section className='FaqWrapper'>
          <div className="faq-intro">
            <p>Find answers to the most common questions about our AI-powered resume builder and cover letter generator. This is an open-source portfolio demo; the code is on <a href='https://github.com/phellwege/resumancyV3' target='_blank' rel='noopener noreferrer'>GitHub</a>.</p>
          </div>
          <div itemScope itemType="https://schema.org/FAQPage">
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="services">What services does Resumancy offer?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    We specialize in AI-driven résumé and cover letter creation. We enhance your base résumé, tailor it to specific job postings, provide a skill gap analysis, generate match percentages for quick insight on alignment, and offer multiple résumé templates. Our goal is to make job applications easier and more effective.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="ai-resume-builder">What is an AI résumé builder?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    An AI résumé builder is a tool that uses artificial intelligence to analyze job descriptions and customize your résumé for specific roles. It helps you create a targeted and compelling résumé that increases your chances of landing the job you want.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="resume-tailoring">How does your service tailor my résumé?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    Our AI analyzes any job description you provide and identifies key skills, qualifications, and keywords. It then tailors your résumé by emphasizing your relevant experience and skills, ensuring your résumé closely matches the job requirements.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="skill-gap">What is a skill gap analysis?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    Our skill gap analysis highlights missing or weaker skills in your résumé compared to the specific job description. This gives you clear, actionable steps to strengthen those areas and improve your qualifications.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="match-percentage">What does the "Match %" represent?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    The Match % is a quick measure of how closely your tailored résumé aligns with a particular job description. The higher the percentage, the better positioned you are for that role. Clicking the Match % in your account also shows a detailed skill gap analysis.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="pricing">Is there a fee for using your service?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    Resumancy is a free demo. You bring your own OpenAI API key, so the only cost is your own OpenAI usage, typically a few cents per tailored résumé with a small model.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="templates">What résumé templates are available?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    We provide multiple professionally designed templates to help your résumé stand out. You can pick the style that best suits your industry and personal branding. 
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="data-security">Is my data secure when using your tool?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                  This version has no server or database. Your profile and résumés are saved only in your own browser. When you generate content, your browser sends your résumé details and the job description directly to OpenAI using your own API key; nothing passes through us. Your key is kept in memory, or in your browser's storage only if you choose to remember it. OpenAI's own API data policies apply to what you send them.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="customization">Can I customize the résumé after the AI generates it?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    Absolutely! While our AI provides tailored suggestions, you have full control over your résumé. Feel free to edit, add, or remove information so it truly reflects you.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="job-types">What types of roles can I create résumés for using this tool?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    You can use our AI résumé builder for a wide range of positions—from entry-level and internships all the way to executive-level roles. Simply provide the job description, and the tool adapts accordingly.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="cover-letters">Do you offer cover letters as well?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    Yes! Every tailored résumé comes with a cover letter customized to the same job description.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="pdf-download">Can I download my résumé in PDF format?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    Yes. You can download your customized résumé as a PDF, making it easy to share or submit to employers.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="customer-support">Is there support if I run into issues?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    This is an unsupported portfolio demo. Most problems come from the API key or model: open Settings, use Test key, and try a different model if yours is not available to your account.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="data-loss">Can I lose my résumés?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    Yes, if your browser's site data is cleared or you switch devices or browsers, because everything is saved only in this browser. Use Export on the Data &amp; Settings page to keep a backup file, and Import to bring it back.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="getting-started">How do I get started with your AI résumé builder?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                  On the home page, paste your OpenAI API key into the card on the right, pick a model and click Save and start. Then input your basic information, enter your existing résumé details (this will be enhanced and used as a baseline), and then paste in the job description you're targeting. Our AI will guide you through building and tailoring your résumé step by step.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
