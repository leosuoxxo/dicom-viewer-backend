// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const runtimeOptions = {
  timeoutSeconds: 540,
  memory: '1GB'
};

const functions = require('firebase-functions').region('asia-east2').runWith(runtimeOptions);

exports.organization = functions.https.onRequest(require("./routes/organization.js"));
