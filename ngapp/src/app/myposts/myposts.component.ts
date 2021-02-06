import { Component, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Post } from '../models/post.model';
import { PostService } from '../post.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PosteditorComponent } from '../posteditor/posteditor.component';
import { DataSnapshot } from '@angular/fire/database/interfaces';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.component.html',
  styleUrls: ['./myposts.component.scss']
})
export class MypostsComponent implements OnInit {

  constructor(
    private postService: PostService,
    public auth: AuthService,
    private afStorage: AngularFireStorage,
    public dialog: MatDialog
  ) { }

  public posts: Observable<SnapshotAction<Post>[]> = new Observable();
  
  ngOnInit(): void {
    this.posts = this.postService.items;
  }

  onNew() {
    const dialogRef = this.dialog.open(PosteditorComponent, {
      width: '60%',
      height: '80%',
      data: { new: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onEdit(post: DataSnapshot) {
    const dialogRef = this.dialog.open(PosteditorComponent, {
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
