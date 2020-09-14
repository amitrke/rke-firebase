import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserProfileComponent } from './user-profile/user-profile.component';

const config = {
  apiKey: "AIzaSyAgvZh2TZUc_n2dvu0oOo6tUgA1nJzEkwM",
  authDomain: "myrke-189201.firebaseapp.com",
  databaseURL: "https://myrke-189201.firebaseio.com",
  projectId: "myrke-189201",
  storageBucket: "myrke-189201.appspot.com",
  messagingSenderId: "670134176077",
  appId: "1:670134176077:web:9ee500127a2e0e0b558f04",
  measurementId: "G-Z48Q0SRCJB"
};

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
