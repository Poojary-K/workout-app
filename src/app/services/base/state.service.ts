import { Injectable, Inject, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseModel } from './base.service';

export const STORAGE_KEY = new InjectionToken<string>('storage.key');

/**
 * State service for handling state management and localStorage persistence
 * @template T - The data model type that extends BaseModel
 */
@Injectable()
export class StateService<T extends BaseModel> {
  private itemsSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public items$: Observable<T[]> = this.itemsSubject.asObservable();

  constructor(@Inject(STORAGE_KEY) private storageKey: string) {
    this.loadFromLocalStorage();
  }

  /**
   * Load data from localStorage
   */
  private loadFromLocalStorage(): void {
    const storedData = localStorage.getItem(this.storageKey);
    if (storedData) {
      const items = JSON.parse(storedData) as T[];
      this.itemsSubject.next(items);
    } else {
      this.itemsSubject.next([]);
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToLocalStorage(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  /**
   * Get all items
   */
  public getItems(): Observable<T[]> {
    return this.items$;
  }

  /**
   * Get current items snapshot
   */
  public getItemsSnapshot(): T[] {
    return this.itemsSubject.getValue();
  }

  /**
   * Set items with processing function
   */
  public setItems(processor: (items: T[]) => T[]): void {
    const currentItems = this.itemsSubject.getValue();
    const processedItems = processor(currentItems);
    this.saveToLocalStorage(processedItems);
  }

  /**
   * Create a new item
   */
  public addItem(item: T): void {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = [...currentItems, item];
    this.saveToLocalStorage(updatedItems);
  }

  /**
   * Update an existing item
   */
  public updateItem(item: T): void {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = currentItems.map(i => i.id === item.id ? item : i);
    this.saveToLocalStorage(updatedItems);
  }

  /**
   * Delete an item
   */
  public deleteItem(id: string): void {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = currentItems.filter(item => item.id !== id);
    this.saveToLocalStorage(updatedItems);
  }
}
