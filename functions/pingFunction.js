const functions = require('firebase-functions');

exports.ping_function = functions.pubsub.schedule('every 10 minutes').onRun((context) => {
    return null;
});