### Repair to working state
TODO: delineate between trialing and subbed
TODO: setup overLimit page that prompts them to upgrade their account

### Flow Correction 
TODO: prevent users from creating a resume if they are over the limit for their tier, then redirect them to upgrade their plan to unlimited with a timer to show how long until the next month rolls around and they can create another 5 on their current plan, or upgrade today.

### Cleanup
TODO: add Success/failure Messages where relevant
TODO: add address changes to the edit for the resume
TODO: update FAQ to reflect changes
 
### Bug
TODO: fix bug on modal size when scrolling
TODO: fix login scaling

### CRITICAL BEFORE DEPLOY
TODO: setup hard limitations for firebase functions
TODO: limit firebase functions to authorized users only (logged in)
TODO: email verifications
TODO: obfuscate code

### Future Updates
1. create custom login / registration - firebaseUI doesn't work with email enumeration
2. add google reviews to website put them on home page
3. Notification for user. Store unread alerts for the user and have a notification icon that appears. (add ads and such to this que so they can be viewed by the user)
4. additional resume styles
5. custom sections
6. add a delete button to the tailored resume table row level -> this must not impact the number of resumes made, and some sort of placeholder will need assigned to that array such as "deleted by user"

### enhancement
 ---- nothing at this time ----

    <!-- premium icon used to delineate between premium features and free features -->
    import { MdOutlineWorkspacePremium } from "react-icons/md";
    <MdOutlineWorkspacePremium />

<!-- TODO: work on business features
TODO: ensure multi user access
    - Charge organizations $500-$1,000/month for multi-user access. -->