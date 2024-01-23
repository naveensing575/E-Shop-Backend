import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

const adminConfig = {
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
};

const firebaseAdmin: admin.app.App = admin.initializeApp(adminConfig);

export { firebaseAdmin };
