import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Books } from '../../interfaces/books';
import { Category } from '../../interfaces/category';
import { Observable, tap } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  books: Books[] = [];
  book: Books[] = [];
  categories: Category[] = [];
  countFavoris: number = 0;

  constructor(
    private apiService: ApiService,
    private toastController: ToastController
  ) {}

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
  NumberFavoris() {
    this.countFavoris = JSON.parse(
      localStorage.getItem('favorites') ?? '[]'
    ).length;
    console.log(this.countFavoris);
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
  async toggleFavorite(book: Books) {
    book.isFavorite = !book.isFavorite;
    console.log('toggleFavorite', book);

    const message = book.isFavorite
      ? 'Ajouter dans mes favories'
      : 'Retiré des favories';

    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
    this.saveToLocalStorage();
    this.NumberFavoris();
  }
  saveToLocalStorage() {
    const favorites = this.books.filter((book) => book.isFavorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  getProgressColor(progress: number): string {
    const red = Math.min(255, Math.floor((1 - progress / 100) * 255));
    const green = Math.min(255, Math.floor((progress / 100) * 165));
    const blue = Math.min(255, Math.floor((progress / 100) * 255));

    return `rgb(${red}, ${green}, ${blue})`;
  }
}
