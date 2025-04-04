import { useEffect } from "react";

const CookieConsent = () => {
  useEffect(() => {
    // 1. Set up dataLayer and gtag (important for Google Consent Mode)
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    // Optional: initial default (especially useful for Google Analytics)
    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    // 2. Load Cookie-Script CMP
    const cookieScript = document.createElement("script");
    cookieScript.type = "text/javascript";
    cookieScript.charset = "UTF-8";
    cookieScript.src = "//cdn.cookie-script.com/s/ddc88124c6567f66fd2699879cb44f51.js";
    cookieScript.async = true;
    document.head.appendChild(cookieScript);

    // 3. Sync CookieScript consent to Google
    const updateGoogleConsent = () => {
      if (window.cookieconsent && window.cookieconsent.consents) {
        const consents = window.cookieconsent.consents;
        gtag('consent', 'update', {
          ad_storage: consents.advertisement ? 'granted' : 'denied',
          analytics_storage: consents.statistics ? 'granted' : 'denied',
          personalization_storage: consents.preferences ? 'granted' : 'denied',
          ad_user_data: consents.advertisement ? 'granted' : 'denied',
          ad_personalization: consents.advertisement ? 'granted' : 'denied',
        });
      }
    };

    window.addEventListener("CookieConsentOnLoad", updateGoogleConsent);
    window.addEventListener("CookieConsentOnChange", updateGoogleConsent);

    return () => {
      document.head.removeChild(cookieScript);
      window.removeEventListener("CookieConsentOnLoad", updateGoogleConsent);
      window.removeEventListener("CookieConsentOnChange", updateGoogleConsent);
    };
  }, []);

  return null;
};

export default CookieConsent;
