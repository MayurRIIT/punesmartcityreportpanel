import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewScholarshipResponseComponent } from './view-scholarship-response.component';

describe('ViewScholarshipResponseComponent', () => {
  let component: ViewScholarshipResponseComponent;
  let fixture: ComponentFixture<ViewScholarshipResponseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewScholarshipResponseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewScholarshipResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
