import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService, Workout, DateUtilsService } from '../services';

interface WorkoutGroup {
  dateLabel: string;
  dateValue: string;
  workouts: Workout[];
}
@Component({
  selector: 'app-workout-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-component.component.html',
  styleUrl: './workout-component.component.css'
})

export class WorkoutComponentComponent implements OnInit {
  title = 'Daily Workout Tracker';
  workouts: Workout[] = [];
  workoutGroups: WorkoutGroup[] = [];
  editingWorkout: Workout | null = null;
  today: string;

  newWorkout = {
    name: '',
    sets: 3,
    reps: 10,
    date: ''
  };

  constructor(
    private workoutService: WorkoutService,
    private dateUtils: DateUtilsService
  ) {
    this.today = this.dateUtils.getTodayDate();
    this.newWorkout.date = this.today;
  }

  ngOnInit(): void {
    // Subscribe to workouts observable
    this.workoutService.getItems().subscribe(workouts => {
      this.workouts = workouts;
      this.groupWorkoutsByDate();
    });
  }

  // Group workouts by date
  groupWorkoutsByDate(): void {
    const groups: { [key: string]: Workout[] } = {};

    // Group workouts by date
    this.workouts.forEach(workout => {
      if (!groups[workout.date]) {
        groups[workout.date] = [];
      }
      groups[workout.date].push(workout);
    });

    // Convert to array of WorkoutGroup objects
    this.workoutGroups = Object.keys(groups).map(date => ({
      dateValue: date,
      dateLabel: this.workoutService.formatDateLabel(date),
      workouts: groups[date]
    }));

    // Sort by date (newest first)
    this.workoutGroups.sort((a, b) =>
      this.dateUtils.compareDatesDesc(a.dateValue, b.dateValue)
    );
  }

  addWorkout(): void {
    if (!this.newWorkout.name.trim()) {
      return; // Don't add workouts without a name
    }

    this.workoutService.addWorkout(
      this.newWorkout.name,
      this.newWorkout.sets,
      this.newWorkout.reps,
      this.newWorkout.date
    );

    // Reset form but keep the selected date
    const selectedDate = this.newWorkout.date;
    this.newWorkout = {
      name: '',
      sets: 3,
      reps: 10,
      date: selectedDate
    };
  }

  startEdit(workout: Workout): void {
    // Create a copy to avoid direct binding
    this.editingWorkout = { ...workout };
  }

  cancelEdit(): void {
    this.editingWorkout = null;
  }

  saveEdit(): void {
    if (this.editingWorkout && this.editingWorkout.name.trim()) {
      this.workoutService.updateWorkout(this.editingWorkout);
      this.editingWorkout = null;
    }
  }

  deleteWorkout(id: string): void {
    if (confirm('Are you sure you want to delete this workout?')) {
      this.workoutService.deleteWorkout(id);
    }
  }

  // Set workout date to today
  setDateToToday(): void {
    this.newWorkout.date = this.dateUtils.getTodayDate();
  }

  // Set workout date to yesterday
  setDateToYesterday(): void {
    this.newWorkout.date = this.dateUtils.getYesterdayDate();
  }
}
