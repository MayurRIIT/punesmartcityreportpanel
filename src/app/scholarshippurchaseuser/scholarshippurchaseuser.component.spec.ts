import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScholarshippurchaseuserComponent } from './scholarshippurchaseuser.component';

describe('ScholarshippurchaseuserComponent', () => {
  let component: ScholarshippurchaseuserComponent;
  let fixture: ComponentFixture<ScholarshippurchaseuserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScholarshippurchaseuserComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScholarshippurchaseuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
