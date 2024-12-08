import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Books } from '../../interfaces/books';
import { Category } from '../../interfaces/category';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  books: Books[] = [];
  book: Books[] = [];
  categories: Category[] = [];
  constructor(private apiService: ApiService) {}

  loadCategories() {
    this.apiService.getDataCategories().subscribe({
      next: (data) => {
        this.categories = data.data;
        console.log('Categories', this.categories);
      },
      error: (error) => {
        console.error(error.error);
      },
    });
  }
  loadItemBook(param: number): Observable<any> {
    return this.apiService
      .getItemBook(param)
      .pipe(tap((data) => console.log('Détail du livre:', data.data)));
  }

  loadBooks() {
    this.apiService.getDataBooks().subscribe({
      next: (data) => {
        this.books = data.data;
        console.log('Livres', this.books);
      },
      error: (error) => {
        console.error(error.error);
      },
    });
  }
}
