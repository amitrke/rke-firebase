import { Component, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Photo } from '../models/photo.model';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-myphotos',
  templateUrl: './myphotos.component.html',
  styleUrls: ['./myphotos.component.scss']
})
export class MyphotosComponent implements OnInit {

  constructor(
    private afStorage: AngularFireStorage,
    public auth: AuthService,
    private photoService: PhotoService
  ) { }
  
  
  public ref;
  public task;
  public uploadProgress;
  public downloadURL: Observable<string>;
  public meta: Observable<any>;
  public photos: Observable<SnapshotAction<Photo>[]> = new Observable();

  ngOnInit(): void {
    const classThis = this;
    this.auth.user$.subscribe({
      next(user){
        classThis.photos = classThis.photoService.list();
        console.log(`Subscribed to photo changes`);
        classThis.photos.subscribe({
          next(photo){
            console.log(`Photo data ${JSON.stringify(photo)}`);
          }
        });
      }
    });
  }

  async upload(event, user) {
    const userUploadedFilename: string = event.target.files[0].name;
    const filenameDotSplit = userUploadedFilename.split(".");
    let filename = userUploadedFilename;
    if (filenameDotSplit.length > 2){
      let fileNmWoExtnAry = [];
      for (let i=0; i<filenameDotSplit.length-1; i++){
        fileNmWoExtnAry.push(filenameDotSplit[i]);
      }
      filename = fileNmWoExtnAry.join("-")+`.${filenameDotSplit[filenameDotSplit.length-1]}`;
    }
    this.ref = this.afStorage.ref(`/users/${user.uid}/${filename}`);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    const classThis = this;
    this.task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = this.ref.getDownloadURL();
          this.meta = this.ref.getMetadata();
          this.meta.subscribe({
            next(md) {
              const photo = new Photo(md.fullPath, md.name, md.updated);
              classThis.photoService.push(photo);
            }
          });
          
        })
    )
    .subscribe()
  }

}
