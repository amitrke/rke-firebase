import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @Input() public photo: DataSnapshot;
  @Input() public thumb: boolean;
  @Input() public readonly: boolean;
  @Output() edit = new EventEmitter<DataSnapshot>();
  public photoObj: Photo;
  public photoUrl: Observable<any>;

  constructor(private storage: AngularFireStorage, private photoService: PhotoService) { }

  ngOnInit(): void {
    this.photoObj = this.photo.val();
    console.log(`MyPhoto is ${JSON.stringify(this.photo)} ${this.photoObj.path}`);
    if (this.photoObj.path) {
      let path = this.photoObj.path;
      if (this.thumb) {
        path = Photo.getThumbPath(path);
      }
      const storageRef = this.storage.ref(path);
      this.photoUrl = storageRef.getDownloadURL();
    }
  }

  onEdit() {
    this.edit.emit(this.photo);
  }

  onDelete() {
    console.log(`Deleting ${this.photoObj.path}`);

    //Delete photo from storage
    const photoRef = this.storage.ref(this.photoObj.path);
    photoRef.delete();

    //Delete photo thumb
    const thumbRef = this.storage.ref(Photo.getThumbPath(this.photoObj.path));
    thumbRef.delete();
    const medRef = this.storage.ref(Photo.getMedPath(this.photoObj.path));
    medRef.delete();
    //Delete db ref
    this.photoService.listItemDelete(this.photo.key);
  }
}
