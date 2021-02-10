import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PosteditorComponent } from './posteditor/posteditor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { MatMenuModule } from '@angular/material/menu';
import { MyphotosComponent } from './myphotos/myphotos.component';
import { PhotoComponent } from './photo/photo.component';
import { PostComponent } from './post/post.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MypostsComponent } from './myposts/myposts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PhotoeditorComponent } from './photoeditor/photoeditor.component';
import { MatListModule } from '@angular/material/list';

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
    UserProfileComponent,
    PosteditorComponent,
    HomeComponent,
    MyphotosComponent,
    PhotoComponent,
    PostComponent,
    MypostsComponent,
    PhotoeditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatToolbarModule,
    MatIconModule,
    AngularEditorModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
