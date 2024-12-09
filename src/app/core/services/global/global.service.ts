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
        this.loadFromLocalStorage();
        this.loadProgressForAllBooks();
        console.log('Livres', this.books);
      },
      error: (error) => {
        console.error(error.error);
      },
    });
  }
  loadFromLocalStorage() {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      const favoriteBooks = JSON.parse(favorites) as Books[];
      this.books.forEach((book) => {
        book.isFavorite = !!favoriteBooks.find((fav) => fav.id === book.id);
      });
    }
  }
  loadProgressForAllBooks() {
    const progressData = JSON.parse(
      localStorage.getItem('readingProgress') || '{}'
    );

    this.books.forEach((book) => {
      if (progressData[book.id]) {
        const savedProgress = progressData[book.id];
        book.progress = savedProgress.progress || 0;
      } else {
        book.progress = 0; // Si aucun progrès n'est trouvé
      }
    });
  }
  getProgressColor(progress: number): string {
    const red = Math.min(255, Math.floor((1 - progress / 100) * 255));
    const green = Math.min(255, Math.floor((progress / 100) * 165));
    const blue = Math.min(255, Math.floor((progress / 100) * 255));

    return `rgb(${red}, ${green}, ${blue})`;
  }
}
