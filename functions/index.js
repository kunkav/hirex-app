const functions = require('firebase-functions');
const admin = require('firebase-admin');
const adminConfig = require('C:/Users/Kun_all/Desktop/hirex-functions/hirex-5f28e-8e36dc15efdd.json');
admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: 'https://hirex-5f28e.firebaseio.com'
});
const app = require('express')();
const firebase = require('firebase');
const config = {
    apiKey: "AIzaSyDkW5WyD4DAvSJtYWLSHZxb3ow4woisa4w",
    authDomain: "hirex-5f28e.firebaseapp.com",
    databaseURL: "https://hirex-5f28e.firebaseio.com",
    projectId: "hirex-5f28e",
    storageBucket: "hirex-5f28e.appspot.com",
    messagingSenderId: "929229162155",
    appId: "1:929229162155:web:9122095c85091734cad9ee",
    measurementId: "G-9Z584C0Z97"
  };

firebase.initializeApp(config);


const db = admin.firestore();

app.get('/posts', (req, res) => {
    db.collection('posts').orderBy('createdAt', 'desc').get()
    .then(data => {
        let posts = [];
        data.forEach(doc => {
            posts.push({
                postId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().companyHandle,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(posts);
    })
    .catch(err => {
        console.error(err);
    })
});

app.post('/post',(req, res) => {    
    
    const newPost = {
        body: req.body.body,
        companyHandle: req.body.companyHandle,
        createdAt: new Date().toISOString()
    };

    db.collection('posts').add(newPost)
    .then(doc => {
        res.json({ message: `document ${doc.id} created successfully.` });
    })    
    .catch(err => {
        res.status(500).json({ error: 'something went wrong' });
        console.error(err);
    });
 }); 


//Signup route

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    //to-do validate data
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists) {
            return res.status(400).json({ handle: 'This handle is already taken' });
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: 'Email is already in use' });
        } else {
        return res.status(500).json({ error: err.code });
        }
    })
    
})



 exports.api = functions.https.onRequest(app); 