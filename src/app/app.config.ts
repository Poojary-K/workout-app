import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { WorkoutService, DateUtilsService, STORAGE_KEY } from './services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    WorkoutService,
    DateUtilsService,
    { provide: STORAGE_KEY, useValue: 'workout-tracker-data' }
  ]
};
