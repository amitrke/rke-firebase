import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PosteditorComponent } from './posteditor.component';

describe('PosteditorComponent', () => {
  let component: PosteditorComponent;
  let fixture: ComponentFixture<PosteditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PosteditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
