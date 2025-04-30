import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { DateUtilsService } from '../base/date-utils.service';
import { Workout } from './workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService extends BaseService<Workout> {
  protected override storageKey = 'workout-tracker-data';

  constructor(protected override dateUtils: DateUtilsService) {
    super(dateUtils);
  }

  /**
   * Sort workouts by date (newest first)
   */
  protected override sortItems(workouts: Workout[]): Workout[] {
    return [...workouts].sort((a, b) =>
      this.dateUtils.compareDatesDesc(a.date, b.date)
    );
  }

  /**
   * Format date to a user-friendly label
   */
  public formatDateLabel(dateStr: string): string {
    return this.dateUtils.formatDateLabel(dateStr);
  }

  /**
   * Add a new workout
   */
  public addWorkout(name: string, sets: number, reps: number, date: string = this.dateUtils.getTodayDate()): void {
    const workout: Workout = {
      id: this.generateId(),
      name,
      sets,
      reps,
      date
    };
    this.createItem(workout);
  }

  /**
   * Update an existing workout
   */
  public updateWorkout(workout: Workout): void {
    this.updateItem(workout);
  }

  /**
   * Delete a workout
   */
  public deleteWorkout(id: string): void {
    this.deleteItem(id);
  }
}
