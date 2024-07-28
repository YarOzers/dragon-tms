import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTestPlanComponent } from './list-test-plan.component';

describe('ListTestPlanComponent', () => {
  let component: ListTestPlanComponent;
  let fixture: ComponentFixture<ListTestPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTestPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTestPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
