import * as admin from 'firebase-admin';
var serviceAccount = require("../firebase-adminsdk.json");
var _ = require('lodash');
const handlebars = require("handlebars");
const fs = require('fs');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myrke-189201.firebaseio.com"
});

var db = admin.database();
const storage = admin.storage();
const bucket = storage.bucket('myrke-189201.appspot.com');

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
      console.log(`- ${postId}`);
      if (post.publish && post.publish === true){
        post.userName = users[userId].name;
        if (post.body){
          post.body = entities.decode(post.body);
        }
        post.id = postId;
        newPosts.push(post);
      }
    })
  })
  return newPosts;
}

async function generateFiles(posts: any) {
  const source = fs.readFileSync("./src/templates/post.hbs", 'utf8');
  const head = fs.readFileSync("./src/templates/partials/head.hbs", 'utf8');
  const topNav = fs.readFileSync("./src/templates/partials/topNav.hbs", 'utf8');
  const footer = fs.readFileSync("./src/templates/partials/footer.hbs", 'utf8');
  const sidebar = fs.readFileSync("./src/templates/partials/sidebar.hbs", 'utf8');
  handlebars.registerPartial('head', head);
  handlebars.registerPartial('topNav', topNav);
  handlebars.registerPartial('footer', footer);
  handlebars.registerPartial('sidebar', sidebar);
  
  const template = handlebars.compile(source, { strict: true });
  
  posts.forEach( async (post:any) => {
    const datePath = post.updated.substring(0, 10);
    const result = template(post);
    const fileName = post.title.split(' ').join('-');
    if (post.photoPath) {
      const srcFilename = post.photoPath;
      const destFilename = `../public/posts/${post.id}.jpg`; //Should be extracted from the source path.
      const options = {
        destination: destFilename,
      };
      // Downloads the file
      await bucket.file(srcFilename).download(options);
    }
    

    
    fs.writeFileSync(`../public/posts/${datePath}-${fileName}.html`, result);
  });
}

async function asyncCall() {
  const posts = await readPosts();
  const users = await readUsers();
  const userPosts = processPosts(posts, users);
  await generateFiles(userPosts);
  app.delete();
}

asyncCall();
