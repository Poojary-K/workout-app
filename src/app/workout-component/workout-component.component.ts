import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService, Workout, DateUtilsService, WorkoutSet } from '../services';

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
    setCount: 3, // Temporary for UI input
    reps: 10,    // Temporary default reps value
    date: '',
    sets: [] as WorkoutSet[] // Will hold the actual sets
  };

  constructor(
    private workoutService: WorkoutService,
    private dateUtils: DateUtilsService
  ) {
    this.today = this.dateUtils.getTodayDate();
    this.newWorkout.date = this.today;
    this.initNewWorkoutSets();
  }

  // Initialize sets for new workout
  initNewWorkoutSets(): void {
    this.newWorkout.sets = [];
    for (let i = 0; i < this.newWorkout.setCount; i++) {
      this.addSetToNewWorkout();
    }
  }

  // Add a set to the new workout
  addSetToNewWorkout(): void {
    this.newWorkout.sets.push({
      id: 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      reps: this.newWorkout.reps
    });
  }

  // Remove a set from the new workout
  removeSetFromNewWorkout(index: number): void {
    this.newWorkout.sets.splice(index, 1);
  }

  // Add a set to the editing workout
  addSetToEditingWorkout(): void {
    if (this.editingWorkout) {
      this.editingWorkout.sets.push({
        id: 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        reps: 10 // Default reps value
      });
    }
  }

  // Remove a set from the editing workout
  removeSetFromEditingWorkout(index: number): void {
    if (this.editingWorkout) {
      this.editingWorkout.sets.splice(index, 1);
    }
  }

  // Update new workout sets when setCount changes
  updateNewWorkoutSets(): void {
    const currentSetsCount = this.newWorkout.sets.length;
    const targetCount = this.newWorkout.setCount;

    if (currentSetsCount < targetCount) {
      // Add sets
      for (let i = currentSetsCount; i < targetCount; i++) {
        this.addSetToNewWorkout();
      }
    } else if (currentSetsCount > targetCount) {
      // Remove sets
      this.newWorkout.sets = this.newWorkout.sets.slice(0, targetCount);
    }
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

    // Create a workout with the actual sets and their rep values
    const workout: Workout = {
      id: 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: this.newWorkout.name,
      sets: this.newWorkout.sets.map(set => ({
        id: 'set_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        reps: set.reps
      })),
      date: this.newWorkout.date
    };

    // Add the workout with custom sets
    this.workoutService.createCustomWorkout(workout);

    // Reset form but keep the selected date
    const selectedDate = this.newWorkout.date;
    this.newWorkout = {
      name: '',
      setCount: 3,
      reps: 10,
      date: selectedDate,
      sets: []
    };
    this.initNewWorkoutSets();
  }

  startEdit(workout: Workout): void {
    // Create a deep copy to avoid direct binding
    this.editingWorkout = {
      ...workout,
      sets: workout.sets.map(set => ({ ...set }))
    };
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

  // Get total sets for a workout
  getTotalSets(workout: Workout): number {
    return workout.sets.length;
  }

  // Calculate total reps across all sets
  getTotalReps(workout: Workout): number {
    return workout.sets.reduce((total, set) => total + set.reps, 0);
  }
}
