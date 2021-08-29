// The Firebase Admin SDK to access the Firebase Real-time Database.
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const appName = 'default';
let app = admin.apps.find(app => app.name === appName);
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
if (!app) {
  adminConfig.credential = admin.credential.cert(serviceAccount[adminConfig.projectId]);
  app = admin.initializeApp(adminConfig, appName);
  app.firestore().settings({ timestampsInSnapshots: true });
}

module.exports = {
  app: {
    db: app.firestore(),
    storage: app.storage(),
  }
};
