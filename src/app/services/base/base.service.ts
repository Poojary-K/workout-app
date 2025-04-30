import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DateUtilsService } from './date-utils.service';

/**
 * BaseModel interface that all models should implement
 */
export interface BaseModel {
  id: string;
  [key: string]: any;
}

/**
 * Abstract base service for handling localStorage persistence
 * @template T - The data model type that extends BaseModel
 */
@Injectable()
export abstract class BaseService<T extends BaseModel> {
  protected abstract storageKey: string;
  protected itemsSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public items$: Observable<T[]> = this.itemsSubject.asObservable();

  constructor(protected dateUtils: DateUtilsService) {
    this.loadFromLocalStorage();
  }

  /**
   * Load data from localStorage
   */
  protected loadFromLocalStorage(): void {
    const storedData = localStorage.getItem(this.storageKey);
    if (storedData) {
      const items = JSON.parse(storedData) as T[];
      this.itemsSubject.next(this.sortItems(items));
    } else {
      this.itemsSubject.next([]);
    }
  }

  /**
   * Save data to localStorage
   */
  protected saveToLocalStorage(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    // After saving, reload the sorted data
    this.loadFromLocalStorage();
  }

  /**
   * Sort items before storing/displaying (to be implemented by child classes)
   */
  protected abstract sortItems(items: T[]): T[];

  /**
   * Create a new item
   */
  protected createItem(item: T): void {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = [...currentItems, item];
    this.saveToLocalStorage(updatedItems);
  }

  /**
   * Update an existing item
   */
  protected updateItem(item: T): void {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = currentItems.map(i => i.id === item.id ? item : i);
    this.saveToLocalStorage(updatedItems);
  }

  /**
   * Delete an item
   */
  protected deleteItem(id: string): void {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = currentItems.filter(item => item.id !== id);
    this.saveToLocalStorage(updatedItems);
  }

  /**
   * Get all items
   */
  public getItems(): Observable<T[]> {
    return this.items$;
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
