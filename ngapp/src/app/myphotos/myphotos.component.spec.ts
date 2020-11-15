import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyphotosComponent } from './myphotos.component';

describe('MyphotosComponent', () => {
  let component: MyphotosComponent;
  let fixture: ComponentFixture<MyphotosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyphotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyphotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
