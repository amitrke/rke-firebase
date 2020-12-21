import * as admin from 'firebase-admin';
var serviceAccount = require("../firebase-adminsdk.json");
var _ = require('lodash');
const handlebars = require("handlebars");
const fs = require('fs');

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

async function readUsers(){
  var ref = db.ref("users");
  const snapshot = await ref.once('value');
  return snapshot.val();
}

function processPosts(posts: any, users: any): any[]{
  const newPosts:any[] = [];
  _.forEach(posts, (userPosts:any, userId: string) => {
    _.forEach(userPosts, (post: any, postId: string) => {
      console.log(`-${users[userId].name} -- ${postId}----------------`);
      if (post.publish && post.publish === true){
        post.userName = users[userId].name;
        newPosts.push(post);
      }
    })
  })
  return newPosts;
}

function generateFiles(posts: any) {
  const source = fs.readFileSync("./src/post.hbs", 'utf8');
  const template = handlebars.compile(source, { strict: true });
  console.log(template);
  posts.forEach( (post:any) => {
    const result = template(post);
    const fileName = post.title.split(' ').join('-');
    fs.writeFileSync(`./output/${fileName}.html`, result);
  });
}

async function asyncCall() {
  const posts = await readPosts();
  const users = await readUsers();
  const userPosts = processPosts(posts, users);
  generateFiles(userPosts);
  app.delete();
}

asyncCall();
