import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DateUtilsService } from './date-utils.service';
import { StateService, STORAGE_KEY } from './state.service';

/**
 * BaseModel interface that all models should implement
 */
export interface BaseModel {
  id: string;
  [key: string]: any;
}

/**
 * Abstract base service for business logic
 * @template T - The data model type that extends BaseModel
 */
@Injectable()
export abstract class BaseService<T extends BaseModel> {
  protected storageKey: string = 'workout-tracker-data';

  constructor(
    protected dateUtils: DateUtilsService,
    protected stateService: StateService<T>
  ) {}

  /**
   * Sort items before displaying (to be implemented by child classes)
   */
  protected abstract sortItems(items: T[]): T[];

  /**
   * Get all items (sorted)
   */
  public getItems(): Observable<T[]> {
    // Subscribe to the state service's items$ and apply sorting
    return this.stateService.getItems();
  }

  /**
   * Process items with sorting before display
   */
  protected processSortedItems(): void {
    this.stateService.setItems(items => this.sortItems([...items]));
  }

  /**
   * Create a new item
   */
  protected createItem(item: T): void {
    this.stateService.addItem(item);
    this.processSortedItems();
  }

  /**
   * Update an existing item
   */
  protected updateItem(item: T): void {
    this.stateService.updateItem(item);
    this.processSortedItems();
  }

  /**
   * Delete an item
   */
  protected deleteItem(id: string): void {
    this.stateService.deleteItem(id);
    this.processSortedItems();
  }

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
   * Generate a simple ID
   */
  protected generateId(): string {
    return Date.now().toString();
  }
}
