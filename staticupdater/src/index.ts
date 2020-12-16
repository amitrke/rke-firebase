import * as admin from 'firebase-admin';
var serviceAccount = require("../firebase-adminsdk.json");

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myrke-189201.firebaseio.com"
});

var db = admin.database();

async function readPosts(){
  var ref = db.ref("posts");
  const snapshot = await ref.once('value');
  return snapshot.val();
}

async function asyncCall() {
  const posts = await readPosts();
  console.log(posts);
  app.delete();
}

asyncCall();
