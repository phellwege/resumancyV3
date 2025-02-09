### Repair to working state
TODO: fix stripe so that it returns correct and expected values for users subscription - looking into this now. this seems like it could be fairly straight forwards but time consuming
TODO: fix the stripe payment thing so it is a stripe payment portal, this way the client cannot edit their email and it is more secure. Call it using a cloud function. 
 - steps to succeed
Step	Action	                                                    Outcome
1	Deploy Firebase Cloud Function for Stripe Portal	Function generates Stripe session URL
2	Frontend calls the Cloud Function & redirects user	User goes to Stripe to manage their plan
3	Deploy Firebase Cloud Function for Stripe Webhooks	Stripe notifies Firebase when plan changes
4	Store updated Stripe status in Firestore	        Keeps user subscription info up-to-date
5	Firebase Listener updates UI automatically	        React app displays new subscription status

TODO: firebase functions:config:set stripe.webhook_secret="your_webhook_secret"
TODO: firebase functions:config:set stripe.secret_key="your_stripe_secret_key"
    
- should be functional now...wait for success tomorrow
TODO: implement some sort of time based delete for resume, tailoredResume and coverLetter as long as they are not base resumes. deleting these records from my db will keep costs lower and also improve performance. maybe rolling 30 day delete
--- added cloud function for this. check to see if vanta only has one entry as of 02/10/2025 - I set one of them to january as a creation date so it should drop off when the cloud function runs 

### Flow Correction 
TODO: setup something so that it prevents users from creating a resume if they are over the limit for their tier, then redirect them to upgrade their plan to unlimited with a timer to show how long until the next month rolls around and they can create another 5 on their current plan, or upgrade today.
    --- maybe a component for this so that it is cleaner and less messy
    TODO: make card showing plans or current plan and usage for home page, basic should have CTA, 
TODO: handle user profile customization on account creation. Created a function to check if the state for initialSetupDone state is set to true, after which they are redirected to a subscription page. They must sign up for a plan before being able to create a resume
    --- maybe a component to handle both of these so that it is cleaner
    TODO: if user clicks create and isnt signed in modal to sign in is displayed.
    TODO: if user clicks create and doesnt have active subscription -> redirect to "/Subscribe"

### Cleanup
TODO: add Success/failure Messages where relevant
TODO: add more places to update address and include it in the resume

### Pricing Strategy
TODO: Implement subscription pricing.
    - free 7 day trial of basic plan
    - Basic Plan: $5/month for up to 5 tailored resumes.
    - Pro Plan: $15/month for unlimited resumes and additional features
 
### Bug
TODO: fix bug on modal size when scrolling

### CRITICAL BEFORE DEPLOY
TODO: setup hard limitations for firebase functions
TODO: limit firebase functions to authorized users only (logged in)

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