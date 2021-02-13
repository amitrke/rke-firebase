import * as admin from 'firebase-admin';
import { mkdirSync } from 'fs';
import { HomepageConfig, RemoteConfigDefaultValueType } from './models/types';
var serviceAccount = require("../firebase-adminsdk.json");
var _ = require('lodash');
const handlebars = require("handlebars");
const fs = require('fs');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const path = require("path");

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myrke-189201.firebaseio.com"
});

var db = admin.database();
var remoteConfig = admin.remoteConfig();
const storage = admin.storage();
const bucket = storage.bucket('myrke-189201.appspot.com');

const head = fs.readFileSync("./src/templates/partials/head.hbs", 'utf8');
const topNav = fs.readFileSync("./src/templates/partials/topNav.hbs", 'utf8');
const footer = fs.readFileSync("./src/templates/partials/footer.hbs", 'utf8');
const sidebar = fs.readFileSync("./src/templates/partials/sidebar.hbs", 'utf8');
handlebars.registerPartial('head', head);
handlebars.registerPartial('topNav', topNav);
handlebars.registerPartial('footer', footer);
handlebars.registerPartial('sidebar', sidebar);

async function readPosts() {
  var ref = db.ref("posts");
  const snapshot = await ref.once('value');
  return snapshot.val();
}

async function readPhotos() {
  var ref = db.ref("album");
  const snapshot = await ref.once('value');
  return snapshot.val();
}

async function readUsers() {
  var ref = db.ref("users");
  const snapshot = await ref.once('value');
  return snapshot.val();
}

function processPosts(posts: any, users: any): any[] {
  const newPosts: any[] = [];
  _.forEach(posts, (userPosts: any, userId: string) => {
    _.forEach(userPosts, (post: any, postId: string) => {
      console.log(`- ${postId}`);
      if (post.publish && post.publish === true) {
        const datePath = post.updated.substring(0, 10);
        const displayDate = new Date(post.updated).toLocaleDateString(
          'en-us',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'utc'
          }
        );
        const fileName = post.title.split(' ').join('-');
        post.userName = users[userId].name;
        if (post.body) {
          post.body = entities.decode(post.body);
        }
        post.htmlFilename = `${datePath}-${fileName}.html`;
        post.id = postId;
        post.displayDate = displayDate;
        newPosts.push(post);
      }
    })
  })
  return newPosts;
}

function processPhotos(photos: any, users: any) {
  const albums:any = {};
  _.forEach(photos, (userPhotos: any, userId: string) => {
    _.forEach(userPhotos, (photo: any, photoId: string) => {
      if (photo.publish == true && photo.album && photo.album.trim() != ""){
        if (!albums[photo.album]) {
          albums[photo.album] = [];
        }
        photo.id=photoId;
        photo.userId = userId;
        albums[photo.album].push(photo);
      }
    })
  })
  return albums;
}

async function generatePostFiles(posts: any) {
  const source = fs.readFileSync("./src/templates/post.hbs", 'utf8');

  const template = handlebars.compile(source, { strict: true });

  posts.forEach(async (post: any) => {
    const result = template({ post, posts });
    if (post.photoPath) {
      const srcFilename = post.photoPath;
      const destFilename = `../public/posts/${post.id}.jpg`; //Should be extracted from the source path.
      await downloadFile(srcFilename, destFilename);
    }
    fs.writeFileSync(`../public/posts/${post.htmlFilename}`, result);
  });
}

async function downloadFile(sourcePath: string, destPath: string) {
  const options = {
    destination: destPath,
  };
  await bucket.file(sourcePath).download(options);
}

async function generateAlbumFiles(albums: any) {
  const source = fs.readFileSync("./src/templates/album.hbs", 'utf8');
  const template = handlebars.compile(source, { strict: true });

  _.forEach(albums, async (photos: any[], albumName: string) => {
    console.log(albumName);
    const albumNameWithDash = albumName.replace(" ", "-");
    const dirPath = path.join(__dirname, "..", "..", "public", "albums", albumNameWithDash);
    console.log("Checking for directory " 
              + dirPath);
    const folderExists = fs.existsSync(dirPath);
    console.log(folderExists ? "The directory already exists" 
                      : "Not found!"); 
    if (!folderExists){
      mkdirSync(dirPath);
    }
    
    const photoArray:any[] = [];
    for (const photo of photos){
      const srcFilename = photo['filename'] as string;
      const pathDotSplit = srcFilename.split('.');
      const fileExtn = pathDotSplit[pathDotSplit.length - 1];
      const file680path = `users/${photo['userId']}/thumbnails/${pathDotSplit[0]}_680x680.${fileExtn}`;
      const destFilename = `../public/albums/${albumNameWithDash}/${pathDotSplit[0]}_680x680.jpg`;
      await downloadFile(file680path, destFilename);
      photo['file680path'] = `${albumNameWithDash}/${pathDotSplit[0]}_680x680.jpg`;
      photoArray.push(photo);
    }
    const result = template({ albumName, albumNameWithDash, photoArray });
    fs.writeFileSync(`../public/albums/${albumNameWithDash}.html`, result);
  })

}

// async function generateAlbumLandingPage(albums: any) {
//   const source = fs.readFileSync("./src/templates/albumLanding.hbs", 'utf8');
//   const template = handlebars.compile(source, { strict: true });

//   _.forEach(albums, async (photos: any[], albumName: string) => {
//     const albumNameWithDash = albumName.replace(" ", "-");
//     const dirPath = path.join(__dirname, "..", "..", "public", "albums", albumNameWithDash);
//     console.log("Checking for directory " 
//               + dirPath);
//     const folderExists = fs.existsSync(dirPath);
//     console.log(folderExists ? "The directory already exists" 
//                       : "Not found!"); 
//     if (!folderExists){
//       mkdirSync(dirPath);
//     }
    
//     const photoArray:any[] = [];
//     for (const photo of photos){
//       const srcFilename = photo['filename'] as string;
//       const pathDotSplit = srcFilename.split('.');
//       const fileExtn = pathDotSplit[pathDotSplit.length - 1];
//       const file680path = `users/${photo['userId']}/thumbnails/${pathDotSplit[0]}_680x680.${fileExtn}`;
//       const destFilename = `../public/albums/${albumNameWithDash}/${pathDotSplit[0]}_680x680.jpg`;
//       await downloadFile(file680path, destFilename);
//       photo['file680path'] = `${albumNameWithDash}/${pathDotSplit[0]}_680x680.jpg`;
//       photoArray.push(photo);
//     }
//     const result = template({ albumName, albumNameWithDash, photoArray });
//     fs.writeFileSync(`../public/albums/${albumNameWithDash}.html`, result);
//   })

// }

async function generateHomepage(posts: any) {
  const source = fs.readFileSync("./src/templates/home.hbs", 'utf8');
  const template = handlebars.compile(source, { strict: true });
  const remoteConfigTemplate = await remoteConfig.getTemplate();
  const homepageConfigParam: RemoteConfigDefaultValueType = remoteConfigTemplate.parameters["webHomepage"] as RemoteConfigDefaultValueType;
  const homepageConfig: HomepageConfig = JSON.parse(homepageConfigParam.defaultValue.value);
  let homepagePost;
  posts.forEach((post: any) => {
    if (post["id"] == homepageConfig["mainPost"]) {
      homepagePost = post;
    }
  });
  const result = template({ homepagePost, homepageConfig, posts });
  fs.writeFileSync(`../public/index.html`, result);
}

async function asyncCall() {
  const posts = await readPosts();
  const photos = await readPhotos();
  const users = await readUsers();
  const albums = await processPhotos(photos, users);
  const userPosts = processPosts(posts, users);
  await generatePostFiles(userPosts);
  await generateAlbumFiles(albums);
  await generateHomepage(userPosts);
  app.delete();
}

asyncCall();
