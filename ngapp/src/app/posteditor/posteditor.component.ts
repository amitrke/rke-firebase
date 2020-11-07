import { Component, OnInit } from '@angular/core';
import { SnapshotAction } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Post } from '../models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-posteditor',
  templateUrl: './posteditor.component.html',
  styleUrls: ['./posteditor.component.scss']
})
export class PosteditorComponent implements OnInit {

  constructor(
    private postService: PostService,
    public auth: AuthService,
    private afStorage: AngularFireStorage,
  ) { }

  public posts: Observable<SnapshotAction<Post>[]> = new Observable();
  public uploadProgress;
  private photoUrl: string = '';
  public editPostId: string;

  postForm = new FormGroup({
    title: new FormControl(''),
    intro: new FormControl(''),
    body: new FormControl(''),
  });

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  ngOnInit(): void {
    this.posts = this.postService.items;
  }

  async save() {
    const post = new Post(
      this.postForm.value.title, 
      this.postForm.value.intro, 
      this.postForm.value.body, 
      this.photoUrl, 
      new Date()
    );
    if (this.editPostId){
      this.postService.listItemUpdate(this.editPostId, post);
    } else {
      const resp = await this.postService.push(post);
      this.editPostId = resp.key;
    }
  }

  new(){
    this.postForm.reset();
    delete this.editPostId;
    
  }

  async upload(event, user) {
    if (!this.editPostId) {
      console.log(`Post not saved yet`);
      return;
    }
    const ref = this.afStorage.ref(`/users/${user.uid}/${this.editPostId}.jpg`);
    const task = ref.put(event.target.files[0]);
    this.uploadProgress = task.percentageChanges();
    const classThis = this;
    task.snapshotChanges().pipe(
        finalize(() => {
          const meta = ref.getMetadata();
          meta.subscribe({
            next(md) {
              classThis.photoUrl = md.fullPath;
            }
          });
          
        })
    )
    .subscribe()
  }
}
