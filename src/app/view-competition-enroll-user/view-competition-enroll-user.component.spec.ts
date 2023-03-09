import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewCompetitionEnrollUserComponent } from './view-competition-enroll-user.component';

describe('ViewCompetitionEnrollUserComponent', () => {
  let component: ViewCompetitionEnrollUserComponent;
  let fixture: ComponentFixture<ViewCompetitionEnrollUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCompetitionEnrollUserComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCompetitionEnrollUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
