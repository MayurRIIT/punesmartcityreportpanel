import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestseriespurchaseuserComponent } from './testseriespurchaseuser.component';

describe('TestseriespurchaseuserComponent', () => {
  let component: TestseriespurchaseuserComponent;
  let fixture: ComponentFixture<TestseriespurchaseuserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestseriespurchaseuserComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestseriespurchaseuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
