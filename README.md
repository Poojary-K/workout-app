# Daily Workout Tracker

A simple workout tracker built with Angular. This application uses localStorage to persist workout data between sessions.

## Features

- Add workouts with name, sets, reps, and date
- Select workout dates via date picker or quick buttons (Today/Yesterday)
- View workouts grouped by date with user-friendly labels (Today, Yesterday, etc.)
- Edit or delete any workout
- Data persists between page reloads using localStorage

## Project Structure

### Services Architecture

The application uses a service-oriented architecture with inheritance:

- **Base Services**
  - `BaseService<T>`: Abstract base service with common localStorage operations
  - `DateUtilsService`: Utility service for date operations

- **Specialized Services**
  - `WorkoutService`: Extends BaseService for workout-specific operations

### Main Components

- **app.component.ts**: Main component that handles the UI interactions
- **app.component.html**: Template for the UI 
- **app.component.css**: Styling for the app

## How to Run the Application

1. Make sure you have Node.js and npm installed
2. Clone or download this repository
3. Open a terminal in the project directory
4. Run `npm install` to install dependencies
5. Run `ng serve` to start the development server
6. Open your browser and navigate to `http://localhost:4200/`

## Implementation Details

### Service Inheritance

The application uses service inheritance to promote code reuse:

- `BaseService<T>`: Provides generic CRUD operations and localStorage handling
- Specialized services extend the base service and override specific methods as needed

### Data Storage

The application uses localStorage to persist workout data. Workouts are stored with the following structure:

```typescript
interface Workout extends BaseModel {
  id: string;
  name: string;
  sets: number;
  reps: number;
  date: string; // In YYYY-MM-DD format
}
```

### State Management

The application uses Angular's reactive programming approach with RxJS BehaviorSubject to manage state. This allows components to reactively update when the workout data changes.

### Date Handling

- Workouts are automatically sorted and grouped by date (newest first)
- "Today" and "Yesterday" labels are displayed instead of dates for better readability
- Historical workouts display the full date
- Date selection is available when adding or editing workouts

## Future Enhancements

Possible future improvements:

- Add more specialized services (e.g., for different workout types)
- Add workout categories or types
- Add workout duration tracking
- Implement user accounts for multi-user support
- Add data visualization for workout progress
- Add weekly/monthly workout summaries

## License

This project is open-source and available under the MIT License.
