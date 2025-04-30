import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { WorkoutService, DateUtilsService } from './services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    WorkoutService,
    DateUtilsService
  ]
};
