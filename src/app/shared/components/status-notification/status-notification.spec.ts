import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusNotification } from './status-notification';

describe('StatusNotification', () => {
  let component: StatusNotification;
  let fixture: ComponentFixture<StatusNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusNotification],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusNotification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
