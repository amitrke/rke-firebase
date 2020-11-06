import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { BaseService } from './base.service';
import { Post } from './models/post.model';
@Injectable({
  providedIn: 'root'
})
export class PostService extends BaseService<Post> {

  constructor(protected db: AngularFireDatabase,
    protected auth: AuthService) {
    super(db, "posts", auth);
  }
}
