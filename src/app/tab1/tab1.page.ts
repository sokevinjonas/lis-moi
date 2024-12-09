import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Books } from '../core/interfaces/books';
import { GlobalService } from '../core/services/global/global.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  filteredBooks: Books[] = [];
  searchTerm: string = '';
  constructor(
    protected globalService: GlobalService,
    private cdr: ChangeDetectorRef, // Injection de ChangeDetectorRef
    private toastController: ToastController
  ) {}

  showAllBooks(category: string) {
    console.log(category);
  }
  ngOnInit() {
    this.setInitialPage();
  }

  setInitialPage() {
    this.globalService.loadCategories();
    this.globalService.loadBooks();
  }

  getBooksByCategory(category: any) {
    return this.globalService.books.filter((book) => {
      return book.categoryId === category.id;
    });
  }

  async toggleFavorite(book: Books) {
    book.isFavorite = !book.isFavorite;
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
  }
  saveToLocalStorage() {
    const favorites = this.globalService.books.filter(
      (book) => book.isFavorite
    );
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}
