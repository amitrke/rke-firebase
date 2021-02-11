import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Photo } from '../models/photo.model';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photoeditor',
  templateUrl: './photoeditor.component.html',
  styleUrls: ['./photoeditor.component.scss']
})
export class PhotoeditorComponent implements OnInit, AfterViewInit {

  constructor(
    private photoService: PhotoService,
    public auth: AuthService,
    private afStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<PhotoeditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      const self = this;
      if (data.new){
        console.log(`New Photo`);
        this.photoForm.reset();
      } else if (data.edit) {
        console.log(`Edit Photo ${JSON.stringify(data.edit)}`);
        this.onEdit(data.edit);
      }
  }

  private currentPhoto: Photo;
  private photoSubject = new Subject<DataSnapshot>();
  public photoObserver = this.photoSubject.asObservable();
  public editPhotoId: string;
  private editSnapshot: DataSnapshot;

  public ref: AngularFireStorageReference;
  public task: AngularFireUploadTask;
  public uploadProgress: Observable<number>;
  public downloadURL: Observable<string>;
  public meta: Observable<any>;
  private fileUploaded = false;

  photoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    album: new FormControl(''),
    description: new FormControl(''),
    photo: new FormControl(null, [Validators.required]),
    publish: new FormControl(false),
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.editSnapshot){
      this.photoSubject.next(this.editSnapshot);
    }
  }

  onFileChanges(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.photoForm.get('photo').setValue(file);
      this.fileUploaded = true;
    }
  }

  async onSave() {
    if (this.photoForm.valid) {
      if (!this.currentPhoto){
        this.currentPhoto = new Photo("", "", new Date());
      }
      this.currentPhoto.updated = new Date();
      this.currentPhoto.publish = this.photoForm.value.publish || false;
      this.currentPhoto.title = this.photoForm.value.title || '';
      this.currentPhoto.album = this.photoForm.value.album || 'default';
      this.currentPhoto.description = this.photoForm.value.description || '';
      if (this.fileUploaded){
        await this.uploadPhoto();
      } else {
        await this.uploadComplete();
      }
      
    } else {
      console.log(this.photoForm.errors);
    }
  }

  async uploadComplete() {
    if (this.editPhotoId) {
      await this.photoService.listItemUpdate(this.editPhotoId, this.currentPhoto);
    } else {
      await this.photoService.push(this.currentPhoto);
    }
    
    this.dialogRef.close();
  }

  async uploadPhoto(){
    const file:File = this.photoForm.value.photo;
    if (file){
      const filenameDotSplit = file.name.split(".");
      let filename = file.name;
      if (filenameDotSplit.length > 2){
        let fileNmWoExtnAry = [];
        for (let i=0; i<filenameDotSplit.length-1; i++){
          fileNmWoExtnAry.push(filenameDotSplit[i]);
        }
        filename = fileNmWoExtnAry.join("-")+`.${filenameDotSplit[filenameDotSplit.length-1]}`;
      }
      this.ref = this.afStorage.ref(`/users/${this.photoService.user.uid}/${filename}`);
      this.task = this.ref.put(file);
      this.uploadProgress = this.task.percentageChanges();
      const classThis = this;
      this.task.snapshotChanges().pipe(
          finalize(() => {
            this.downloadURL = this.ref.getDownloadURL();
            this.meta = this.ref.getMetadata();
            this.meta.subscribe({
              async next(md) {
                classThis.currentPhoto.path = md.fullPath;
                classThis.currentPhoto.filename = md.name;
                classThis.currentPhoto.updated = md.updated;
                await classThis.uploadComplete();
              }
            });
          })
      )
      .subscribe()
    }
    
  }

  onCancel(){
    this.dialogRef.close();
  }

  onEdit(photo: DataSnapshot) {
    this.editSnapshot = photo;
    this.editPhotoId = photo.key;
    this.currentPhoto = photo.val();
    this.photoForm.reset();
    this.photoForm.patchValue({
      title: this.currentPhoto.title,
      description: this.currentPhoto.description,
      publish: this.currentPhoto.publish,
      album: this.currentPhoto.album,
      photo: this.currentPhoto.path
    });
  }
}
