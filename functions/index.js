const functions = require('firebase-functions');
const FBAuth = require('./util/fbauth');

const { getAllPosts, postOnePost, getPost, commentOnPost, likePost, unlikePost, deletePost } = require('./handlers/posts');
const { signUp, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');
//const config = require('./util/config');
const app = require('express')();
const firebase = require('firebase');


//firebase.initializeApp(config);



//posts route
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, postOnePost); 
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/post/:postId', getPost);
//delete post
app.delete('/post/:postId', FBAuth, deletePost);
//like a post
app.get('/post/:postId/like', FBAuth, likePost);
//unlike a post
app.get('/post/:postId/unlike', FBAuth, unlikePost);
//comment on post
app.post('/post/:postId/comment', FBAuth, commentOnPost);

//users route
app.post('/signup', signUp);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);





 exports.api = functions.https.onRequest(app); 