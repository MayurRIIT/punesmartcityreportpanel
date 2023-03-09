import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VyakhyanmalaComponent } from './vyakhyanmala.component';

describe('VyakhyanmalaComponent', () => {
  let component: VyakhyanmalaComponent;
  let fixture: ComponentFixture<VyakhyanmalaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VyakhyanmalaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VyakhyanmalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
