import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumQuizComponent } from './album-quiz.component';

describe('AlbumQuizComponent', () => {
  let component: AlbumQuizComponent;
  let fixture: ComponentFixture<AlbumQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
