import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { BaseService } from './base.service';
import { Photo } from './models/photo.model';
@Injectable({
  providedIn: 'root'
})
export class PhotoService extends BaseService<Photo> {

  constructor(protected db: AngularFireDatabase, protected auth: AuthService) {
    super(db, "album", auth);
  }
  
}
