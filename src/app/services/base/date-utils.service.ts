import { Injectable } from '@angular/core';

/**
 * Service for date-related utility functions
 */
@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {
  /**
   * Get today's date in YYYY-MM-DD format
   */
  public getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get yesterday's date in YYYY-MM-DD format
   */
  public getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  /**
   * Format date to a user-friendly label
   */
  public formatDateLabel(dateStr: string): string {
    const today = this.getTodayDate();
    const yesterday = this.getYesterdayDate();

    if (dateStr === today) {
      return 'Today';
    } else if (dateStr === yesterday) {
      return 'Yesterday';
    } else {
      // Format date as MM/DD/YYYY
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    }
  }

  /**
   * Get a date N days ago
   */
  public getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  /**
   * Compare dates for sorting (newest first)
   */
  public compareDatesDesc(date1: string, date2: string): number {
    return new Date(date2).getTime() - new Date(date1).getTime();
  }
}
