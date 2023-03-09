import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubjectteacherlinkupComponent } from './subjectteacherlinkup.component';

describe('SubjectteacherlinkupComponent', () => {
  let component: SubjectteacherlinkupComponent;
  let fixture: ComponentFixture<SubjectteacherlinkupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectteacherlinkupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectteacherlinkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
