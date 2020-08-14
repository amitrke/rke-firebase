set -e

cd ngapp
ng build --prod

firebase target:apply hosting ngapp ngrke2
firebase deploy --only hosting:ngapp

cd ..

firebase target:apply hosting static myrke-189201
firebase deploy --only hosting:static