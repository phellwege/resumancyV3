const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp();

const function1 = require('./generateCoverLetter');
const function2 = require('./customerSubscriptionCreated');
const function3 = require('./generateTailoredResume');
const function4 = require('./generateBaseResume');
const function5 = require('./cleanupOldEntries');
const function6 = require('./createStripeCustomer');

exports.generate_cover_letter = function1;
exports.handle_stripe_webhook = function2;
exports.generate_tailored_resume = function3;
exports.generate_base_resume = function4;
exports.cleanUpOldEntries = function5;
exports.createStripeCustomer = function6;