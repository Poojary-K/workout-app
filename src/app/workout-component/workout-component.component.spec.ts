import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutComponentComponent } from './workout-component.component';

describe('WorkoutComponentComponent', () => {
  let component: WorkoutComponentComponent;
  let fixture: ComponentFixture<WorkoutComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create the app', () => {
      const fixture = TestBed.createComponent(WorkoutComponentComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });
  
    it(`should have the 'workout-tracker' title`, () => {
      const fixture = TestBed.createComponent(WorkoutComponentComponent);
      const app = fixture.componentInstance;
      expect(app.title).toEqual('workout-tracker');
    });
  
    it('should render title', () => {
      const fixture = TestBed.createComponent(WorkoutComponentComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain('Hello, workout-tracker');
    });
});
