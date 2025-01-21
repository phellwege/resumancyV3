### Repair to working state
TODO: fix stripe so that it returns correct and expected values for users subscription - looking into this now. this seems like it could be fairly straight forwards but time consuming
TODO: fix resume creation and cover letter creation now that it is an array of objects
TODO: fix review page since it is an array of objects
TODO: on edit user information / save implement function to add the info to firebase

### Flow Correction 
TODO: handle user profile customization on account creation. Created a function to check if the state for initialSetupDone state is set to true, and prevent routing to other pages if false....

### Add Feature
TODO: write functions for database connection and storage of state managed information from dataContext
TODO: Develop effective subscription pricing.
    - free trial of basic plan
    - Basic Plan: $5/month for up to 5 tailored resumes.(and some formatting options)
    - Pro Plan: $15/month for unlimited resumes and additional features (full feature suit)

### Bug
TODO: fix bug on modal size when scrolling
TODO: switch from edit modal to edit page so that there is no cutoff and user can edit whatever they need to
TODO: if editing on close modal then it stays in edit mode instead of returning to default state

### CRITICAL BEFORE DEPLOY
TODO: setup hard limitations for firebase functions

### Future Updates
1. create custom login / registration - firebaseUI doesn't work with email enumeration
2. add google reviews to website put them on home page
3. Notification for user. Store unread alerts for the user and have a notification icon that appears. (add ads and such to this que so they can be viewed by the user)

### enhancement
 ---- nothing at this time ----

    <!-- premium icon used to delineate between premium features and free features -->
    import { MdOutlineWorkspacePremium } from "react-icons/md";
    <MdOutlineWorkspacePremium />

<!-- TODO: work on business features
TODO: ensure multi user access
    - Charge organizations $500-$1,000/month for multi-user access. -->