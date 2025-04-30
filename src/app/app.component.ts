import { Component } from '@angular/core';
import { WorkoutComponentComponent } from "./workout-component/workout-component.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkoutComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Daily Workout Tracker';
}
