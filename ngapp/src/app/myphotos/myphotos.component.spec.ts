import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyphotosComponent } from './myphotos.component';

describe('MyphotosComponent', () => {
  let component: MyphotosComponent;
  let fixture: ComponentFixture<MyphotosComponent>;

  beforeEach(async(() => {
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
