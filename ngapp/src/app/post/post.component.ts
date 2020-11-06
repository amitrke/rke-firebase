import { Component, Input, OnInit } from '@angular/core';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';
import { Post } from '../models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() public post: DataSnapshot;
  public postObj: Post;
  public photoUrl: Observable<string>;
  constructor(
    private postService: PostService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.postObj = this.post.val();
    if (this.postObj.photoPath) {
      let path = Photo.getMedPath(this.postObj.photoPath);
      const storageRef = this.storage.ref(path);
      this.photoUrl = storageRef.getDownloadURL();
    }
  }

  onDelete() {
    if (this.postObj.photoPath.length > 1){
      
      //Delete photo from storage
      const photoRef = this.storage.ref(this.postObj.photoPath);
      photoRef.delete();

      //Delete photo thumb
      const thumbRef = this.storage.ref(Photo.getThumbPath(this.postObj.photoPath));
      thumbRef.delete();
      const medRef = this.storage.ref(Photo.getMedPath(this.postObj.photoPath));
      medRef.delete();
    }
    this.postService.listItemDelete(this.post.key);
  }
}
