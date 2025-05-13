import { Injectable, Inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { DateUtilsService } from '../base/date-utils.service';
import { StateService, STORAGE_KEY } from '../base/state.service';
import { Workout, WorkoutSet } from './workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService extends BaseService<Workout> {
  constructor(
    protected override dateUtils: DateUtilsService,
    @Inject(STORAGE_KEY) stateServiceStorageKey: string
  ) {
    // Create a new StateService with the storage key
    const stateService = new StateService<Workout>(stateServiceStorageKey || 'workout-tracker-data');
    super(dateUtils, stateService);
    this.migrateWorkoutsToNewFormat();
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
   * Migrate old workout format to new format with sets
   */
  private migrateWorkoutsToNewFormat(): void {
    const currentItems = this.stateService.getItemsSnapshot();
    let needsMigration = false;

    const migratedItems = currentItems.map(workout => {
      // Check if this is an old format workout (sets is a number, not an array)
      if (typeof workout.sets === 'number' && 'reps' in workout) {
        needsMigration = true;

        // Convert to new format
        const newWorkout: Workout = {
          ...workout,
          sets: this.createInitialSets(workout.sets as unknown as number, (workout as any).reps)
        };

        // Remove old "reps" property
        delete (newWorkout as any).reps;

        return newWorkout;
      }

      return workout;
    });

    // Save migrated data if needed
    if (needsMigration) {
      this.stateService.setItems(() => migratedItems);
    }
  }

  /**
   * Format date to a user-friendly label
   */
  public formatDateLabel(dateStr: string): string {
    return this.dateUtils.formatDateLabel(dateStr);
  }

  /**
   * Generate a unique ID for sets
   */
  private generateSetId(): string {
    return 'set_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Create initial sets with the given number of reps
   */
  private createInitialSets(setCount: number, reps: number): WorkoutSet[] {
    const sets: WorkoutSet[] = [];
    for (let i = 0; i < setCount; i++) {
      sets.push({
        id: this.generateSetId(),
        reps: reps
      });
    }
    return sets;
  }

  /**
   * Add a new workout
   */
  public addWorkout(name: string, setCount: number, reps: number, date: string = this.dateUtils.getTodayDate()): void {
    const workout: Workout = {
      id: this.generateId(),
      name,
      sets: this.createInitialSets(setCount, reps),
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

  /**
   * Create a workout with custom sets
   */
  public createCustomWorkout(workout: Workout): void {
    // Ensure the workout has a proper ID
    if (!workout.id || workout.id.startsWith('temp_')) {
      workout.id = this.generateId();
    }

    // Ensure each set has a proper ID
    workout.sets = workout.sets.map(set => {
      if (!set.id || set.id.startsWith('temp_')) {
        return {
          ...set,
          id: this.generateSetId()
        };
      }
      return set;
    });

    this.createItem(workout);
  }
}
