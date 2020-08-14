## Deploy
### Angular App
firebase target:apply hosting ngapp ngrke2
firebase deploy --only hosting:ngapp

### Static Webapp
firebase target:apply hosting static myrke-189201
firebase deploy --only hosting:static