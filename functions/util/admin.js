const admin = require('firebase-admin');
const adminConfig = require('C:/Users/Kun_all/Desktop/hirex-functions/hirex-5f28e-8e36dc15efdd.json');
admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: 'https://hirex-5f28e.firebaseio.com'
});
const db = admin.firestore();

module.exports = { admin, db };