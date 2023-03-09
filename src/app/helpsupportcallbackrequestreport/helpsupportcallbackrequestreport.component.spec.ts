import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpsupportcallbackrequestreportComponent } from './helpsupportcallbackrequestreport.component';

describe('HelpsupportcallbackrequestreportComponent', () => {
  let component: HelpsupportcallbackrequestreportComponent;
  let fixture: ComponentFixture<HelpsupportcallbackrequestreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpsupportcallbackrequestreportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpsupportcallbackrequestreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
