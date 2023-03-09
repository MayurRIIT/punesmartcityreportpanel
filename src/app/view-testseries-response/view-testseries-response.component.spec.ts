import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewTestSeriesResponseComponent } from './view-testseries-response.component';

describe('ViewTestSeriesResponseComponent', () => {
  let component: ViewTestSeriesResponseComponent;
  let fixture: ComponentFixture<ViewTestSeriesResponseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTestSeriesResponseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTestSeriesResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
