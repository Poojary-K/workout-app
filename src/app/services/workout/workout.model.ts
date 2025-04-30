import { BaseModel } from '../base/base.service';

export interface Workout extends BaseModel {
  id: string;
  name: string;
  sets: number;
  reps: number;
  date: string; // ISO string format (YYYY-MM-DD)
}
