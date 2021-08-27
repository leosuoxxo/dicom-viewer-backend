import * as firebaseFunctions from "firebase-functions";
import OrganizationRoutes from './routes/organization';
import DocsRoutes from './routes/docs';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

const functions = firebaseFunctions.region('asia-east2').runWith({
  timeoutSeconds: 540,
  memory: '1GB'
});


exports.organization = functions.https.onRequest(OrganizationRoutes);


exports.docs = functions.https.onRequest(DocsRoutes);
