import { BaseModel } from '../base/base.service';

export interface WorkoutSet {
  id: string;
  reps: number;
}

export interface Workout extends BaseModel {
  id: string;
  name: string;
  sets: WorkoutSet[];
  date: string; // ISO string format (YYYY-MM-DD)
}
