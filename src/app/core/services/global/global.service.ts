import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Books } from '../../interfaces/books';
import { Category } from '../../interfaces/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  books: Books[] = [];
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
