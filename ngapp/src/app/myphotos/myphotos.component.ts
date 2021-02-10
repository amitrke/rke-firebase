import { Component, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/database';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Photo } from '../models/photo.model';
import { PhotoService } from '../photo.service';
import { PhotoeditorComponent } from '../photoeditor/photoeditor.component';

@Component({
  selector: 'app-myphotos',
  templateUrl: './myphotos.component.html',
  styleUrls: ['./myphotos.component.scss']
})
export class MyphotosComponent implements OnInit {

  constructor(
    private afStorage: AngularFireStorage,
    public auth: AuthService,
    public photoService: PhotoService,
    public dialog: MatDialog
  ) { }
  
  
  public ref;
  public task;
  public uploadProgress;
  public downloadURL: Observable<string>;
  public meta: Observable<any>;

  ngOnInit(): void {
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

  onNew() {
    const dialogRef = this.dialog.open(PhotoeditorComponent, {
      width: '60%',
      height: '80%',
      data: { new: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onEdit(post: DataSnapshot) {
    const dialogRef = this.dialog.open(PhotoeditorComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '80vh',
      maxWidth:'80vw',
      data: { edit: post }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
