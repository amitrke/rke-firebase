import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user.model'; // optional

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    user$: Observable<User>;

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router
    ) { 
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.db.object<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      )
    }

    async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
    }
  
    private updateUserData(user) {
      // Sets user data to firestore on login
      const userRef = this.db.object(`users/${user.uid}`);
      var date = new Date();

      const data = { 
        uid: user.uid, 
        email: user.email, 
        lastSeen: date.toISOString(),
        name: user.displayName, 
        photoURL: user.photoURL
      } 
  
      return userRef.update(data);
    }
  
    async signOut() {
      await this.afAuth.signOut();
      this.router.navigate(['/']);
    }
  
}