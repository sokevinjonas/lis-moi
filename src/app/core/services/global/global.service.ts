import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Books } from '../../interfaces/books';
import { Category } from '../../interfaces/category';

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
  async loadItemBook(param: number): Promise<Books> {
    return this.apiService
      .getItemBook(param)
      .toPromise()
      .then(
        (response) => {
          console.log('Item:', response.data);
          return response.data[0]; // Retourne les données
        },
        (error) => {
          console.error('Erreur lors du chargement du livre:', error);
          throw error; // Laisse l'erreur être gérée par l'appelant
        }
      );
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
