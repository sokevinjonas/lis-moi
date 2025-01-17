import { Component, OnInit } from '@angular/core';
import { Books } from '../core/interfaces/books';
import { GlobalService } from '../core/services/global/global.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  filteredBooks: Books[] = [];
  searchTerm: string = '';

  constructor(protected globalService: GlobalService) {}

  showAllBooks(category: string) {
    console.log(category);
  }
  ngOnInit() {
    this.setInitialPage();
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.setInitialPage();
      event.target.complete();
    }, 2000);
  }

  setInitialPage() {
    this.globalService.loadCategories();
    this.globalService.loadBooks();
    this.globalService.NumberFavoris();
  }

  getBooksByCategory(category: any) {
    // console.log(category);
    return this.globalService.books.filter((book) => {
      return book.category_id === category.id;
    });
  }

  // Method to get responsive slides per view
  getSlidesPerView(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth < 320) return 1;
    if (screenWidth < 480) return 2;
    if (screenWidth < 640) return 3;
    return 4;
  }

  // Method to truncate title
  truncateTitle(title: string, maxLength: number = 60): string {
    if (!title) return '';
    return title.length > maxLength
      ? title.substring(0, maxLength) + '...'
      : title;
  }
}
