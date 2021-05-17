import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

  get<T = any>(id: string): T {
    const value = localStorage.getItem(id);
    return value ? JSON.parse(value) : null;
  }

  save(id: string, value: any) {
    localStorage.setItem(id, JSON.stringify(value));
  }

}
