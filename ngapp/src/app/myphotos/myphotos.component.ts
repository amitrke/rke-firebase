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

  ngOnInit(): void {
  }

  onNew() {
    const dialogRef = this.dialog.open(PhotoeditorComponent, {
      width: '70%',
      height: '90%',
      data: { new: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onEdit(post: DataSnapshot) {
    const dialogRef = this.dialog.open(PhotoeditorComponent, {
      width: '70%',
      height: '90%',
      maxHeight: '80vh',
      maxWidth:'90vw',
      data: { edit: post }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
