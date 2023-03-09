import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EvaluateTestSeriesResponseComponent } from './evaluate-testseries-response.component';

describe('EvaluateTestSeriesResponseComponent', () => {
  let component: EvaluateTestSeriesResponseComponent;
  let fixture: ComponentFixture<EvaluateTestSeriesResponseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateTestSeriesResponseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluateTestSeriesResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
