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


### Flow Correction 
TODO: setup something so that it prevents users from creating a resume if they are over the limit for their tier and also redirect them to upgrade their pricing tier with a timer to show how long until the next month rolls around and they can create another 5 on their current plan.
TODO: make card showing plans or current plan and usage for home page
TODO: handle user profile customization on account creation. Created a function to check if the state for initialSetupDone state is set to true, and prevent routing to other pages if false....
TODO: add Success/failure Messages where relevant


### Add Feature
TODO: Implement subscription pricing.
    - free 7 day trial of basic plan
    - Basic Plan: $5/month for up to 5 tailored resumes.(and some formatting options)
    - Pro Plan: $15/month for unlimited resumes and additional features (full feature suit)
 
### Bug
TODO: fix bug on modal size when scrolling
TODO: fix extra experience being created on click to add. (not sure exactly why this is occurring)

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