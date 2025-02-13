### Repair to working state
TODO: fix the stripe payment thing so it is a stripe payment portal, this way the client cannot edit their email and it is more secure. Call it using a cloud function. 
 - steps to succeed
Step	Action	                                                    Outcome
1	Deploy Firebase Cloud Function for Stripe Portal	Function generates Stripe session URL
2	Frontend calls the Cloud Function & redirects user	User goes to Stripe to manage their plan
3	Deploy Firebase Cloud Function for Stripe Webhooks	Stripe notifies Firebase when plan changes
4	Store updated Stripe status in Firestore	        Keeps user subscription info up-to-date
5	Firebase Listener updates UI automatically	        React app displays new subscription status

TODO: add manage account section to delete acct, change subscription etc.
TODO: add a button to delete account which will cancel their subscription and remove their user

### Flow Correction 
TODO: prevent users from creating a resume if they are over the limit for their tier, then redirect them to upgrade their plan to unlimited with a timer to show how long until the next month rolls around and they can create another 5 on their current plan, or upgrade today.
    --- maybe a component for this so that it is cleaner and less messy
    TODO: make card showing plans or current plan and usage for home page, basic should have CTA, 
TODO: handle user profile customization on account creation.
    --- maybe a component to handle both of these so that it is cleaner
    TODO: if user clicks create and doesn't have active subscription -> redirect to "/Subscribe"

### Cleanup
TODO: add Success/failure Messages where relevant
TODO: add address changes to the edit for the resume
 
### Bug
TODO: fix bug on modal size when scrolling

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