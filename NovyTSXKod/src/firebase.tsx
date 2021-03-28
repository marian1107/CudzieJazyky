import Firebase from 'firebase';
import base from 're-base';
import firebaseConfig from './Config/firebase';

const app = Firebase.initializeApp(firebaseConfig);
const db = Firebase.firestore(app);
db.settings({});
export const rebase = base.createClass(db);
export const firebase = db;
export const auth = Firebase.auth();
export const profilove = app.storage().ref('profilove_obrazky');