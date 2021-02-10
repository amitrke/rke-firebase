import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import { Photo } from '../models/photo.model';

@Component({
  selector: 'app-photoeditor',
  templateUrl: './photoeditor.component.html',
  styleUrls: ['./photoeditor.component.scss']
})
export class PhotoeditorComponent implements OnInit, AfterViewInit {

  constructor(public auth: AuthService,
    private afStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<PhotoeditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      if (data.new){
        console.log(`New Photo`);
        this.photoForm.reset();
      } else if (data.edit) {
        console.log(`Edit Photo ${JSON.stringify(data.edit)}`);
        this.onEdit(data.edit);
      }
  }

  private photoSubject = new Subject<DataSnapshot>();
  public photoObserver = this.photoSubject.asObservable();
  public editPhotoId: string;
  private editSnapshot: DataSnapshot;

  photoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    publish: new FormControl(false),
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.editSnapshot){
      this.photoSubject.next(this.editSnapshot);
      delete this.editSnapshot;
    }
  }
  
  async onSave() {

  }

  onCancel(){

  }

  onEdit(photo: DataSnapshot) {
    this.editSnapshot = photo;
    this.editPhotoId = photo.key;
    const photoObj: Photo = photo.val();
    this.photoForm.reset();
    this.photoForm.patchValue({
      title: photoObj.title,
      description: photoObj.description,
      publish: photoObj.publish
    });
  }
}
