import { Component } from '@angular/core';
import { Books } from '../core/interfaces/books';
import { Category } from '../core/interfaces/category';
import { ApiService } from '../core/services/api/api.service';
import { GlobalService } from '../core/services/global/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  filteredBooks: Books[] = [];
  searchTerm: string = '';
  constructor(protected globalService: GlobalService, private router: Router) {
    globalService.loadBooks();
    globalService.loadCategories();
    // this.generateMockData();
  }

  showAllBooks(category: string) {
    // Implémenter la navigation vers la vue complète de la catégorie
    console.log(category);
  }
  ngOnInit() {}

  getBooksByCategory(category: any) {
    return this.globalService.books.filter((book) => {
      return book.categoryId === category.id;
    });
  }

  toggleFavorite(book: Books) {
    // book.isFavorite = !book.isFavorite;
    // this.saveToLocalStorage();
  }

  readBook(book: Books) {
    // À implémenter : redirection vers la visionneuse PDF
    // Vérifie si le livre a une URL valide (PDF ou EPUB)
    if (book.url) {
      // Redirige vers la page de lecture en passant l'URL du livre
      this.router.navigate(['/reader'], {
        queryParams: { bookUrl: book.url },
      });
    }
  }
}
