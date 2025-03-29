const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp();

const function1 = require('./generateCoverLetter');
const function2 = require('./customerSubscriptionCreated');
const function3 = require('./generateTailoredResume');
const function4 = require('./generateBaseResume');
const function5 = require('./cleanupOldEntries');
const function6 = require('./createStripeCustomer');
const function7 = require('./createStripePortalSession');
const function8 = require('./deleteUserAccount');
const function9 = require('./generateGapAnalysisWithRetry');
const function10 = require('./limitedFunction');
const createStripeCoupon = require('./createStripeCoupon').createStripeCoupon;
const createStripeCouponHttp = require('./createStripeCouponHttp').createStripeCouponHttp;

exports.generate_cover_letter = function1;
exports.handle_stripe_webhook = function2;
exports.generate_tailored_resume = function3;
exports.generate_base_resume = function4;
exports.cleanUpOldEntries = function5;
exports.createStripeCustomer = function6;
exports.createStripePortalSession = function7;
exports.deleteUserAccount = function8;
exports.generateGapAnalysisWithRetry = function9;
exports.limitedFunction = function10;
exports.createStripeCoupon = createStripeCoupon;
exports.createStripeCouponHttp = createStripeCouponHttp;