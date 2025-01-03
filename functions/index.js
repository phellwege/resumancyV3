const functions = require('firebase-functions');

const function1 = require('./generateCoverLetter');
const function2 = require('./customerSubscriptionCreated');
const function3 = require('./generateTailoredResume');
const function4 = require('./generateBaseResume');


exports.generate_cover_letter = function1;
exports.handle_stripe_webhook = function2;
exports.generate_tailored_resume = function3;
exports.generate_base_resume = function4;
