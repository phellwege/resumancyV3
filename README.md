### Repair to working state
TODO: fix stripe so that it returns correct and expected values for users subscription

### Flow Correction 
TODO: handle user profile customization on account creation. 1st sign in should take them to a page to finish setup of their account. Created a function to check if the state for initialSetupDone state is set to true, and prevent routing to other pages if false.... I will also implement a navigation blocker and an alert message

### Add Feature
TODO: fix other resumeStyles for review / flow for this.
TODO: add edit to cover letter functionality.
TODO: write functions for database connection and storage of state managed information from dataContext
TODO: Develop effective subscription pricing.
    - free base resume (no formatting options, option to make 1 tailored resume / cover letter unless on paid tier)
    - Basic Plan: $5/month for up to 5 tailored resumes.(and some formatting options)
    - Pro Plan: $15/month for unlimited resumes and additional features (full feature suit)

### Bug
TODO: fix bug on modal size when scrolling
TODO: switch from edit modal to edit page so that there is no cutoff and user can edit whatever they need to

### CRITICAL BEFORE DEPLOY
TODO: setup hard limitations for firebase functions

### Future Updates
1. create custom login / registration - firebaseUI doesn't work with email enumeration
2. add google reviews to website put them on home page


    <!-- premium icon used to delineate between premium features and free features -->
    import { MdOutlineWorkspacePremium } from "react-icons/md";
    <MdOutlineWorkspacePremium />

<!-- TODO: work on business features
TODO: ensure multi user access
    - Charge organizations $500-$1,000/month for multi-user access. -->