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
        <meta name="description" content="Get answers to common questions about Resumancy's AI resume builder, cover letter generator, skill gap analysis, pricing plans, and more." />
        <link rel="canonical" href="https://resumancy.com/FAQ" />
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
                    "text": "We offer a free 7-day trial of the Basic Plan. Our Basic Plan is $5/month and includes one base résumé and up to five tailored résumés or cover letters per month. Our Premium Plan is $15/month and provides unlimited tailored résumés and cover letters."
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
            <p>Find answers to the most common questions about our AI-powered resume builder and cover letter generator. If you don't see your question answered here, please contact us at <a href='mailto:Support@Resumancy.com'>Support@Resumancy.com</a>.</p>
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
                    We offer a free 7-day trial of the Basic Plan. Our Basic Plan is <strong>$5/month</strong> and includes one base résumé and up to five tailored résumés or cover letters per month. Our Premium Plan is <strong>$15/month</strong> and provides unlimited tailored résumés and cover letters.
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
                  We take data security very seriously. We transmit your résumé data to our AI provider (OpenAI) strictly for the purpose of generating résumés, cover letters, and skill gap analyses. We do not sell your data or share it with other third parties. Where possible, we configure our AI provider not to store or train on your information. Your personal details and résumé content remain private, and we implement best practices to safeguard your data.
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
                    Yes! You can generate a cover letter customized to the same job description. Each plan includes cover letter generation: up to five per month on the Basic Plan and unlimited on the Premium Plan.
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
              <h2 itemProp="name" id="customer-support">Is there customer support available if I encounter any issues?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    We provide customer support for any technical issues or questions you may have. Please allow up to 48 hours for a response. You can reach our support team at <a href='mailto:Support@Resumancy.com'>Support@Resumancy.com</a>
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="getting-started">How do I get started with your AI résumé builder?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                  Simply sign up, input your basic information, enter your existing résumé details (this will be enhanced and used as a baseline), and then paste in the job description you're targeting. Our AI will guide you through building and tailoring your résumé step by step.
                  </p>
                </div>
              </div>
            </div>

            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 itemProp="name" id="subscription-change">How do I change my subscription?</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p>
                    To change or cancel your subscription, open the menu and go to "Profile," or click on your avatar. Select "Manage Account" and choose the plan or cancellation option that fits your needs.
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
