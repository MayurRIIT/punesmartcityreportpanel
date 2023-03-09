import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EvaluateScholarshipResponseComponent } from './evaluate-scholarship-response.component';

describe('EvaluateScholarshipResponseComponent', () => {
  let component: EvaluateScholarshipResponseComponent;
  let fixture: ComponentFixture<EvaluateScholarshipResponseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateScholarshipResponseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluateScholarshipResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
