import { Component } from '@angular/core';
interface Book {
  id: number;
  title: string;
  category: string;
  description: string;
  coverUrl: string;
  progress?: number;
  isFavorite: boolean;
  readCount: number;
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  categories: string[] = [];
  mostReadBooks: Book[] = [];
  constructor() {
    this.generateMockData();
    this.categories = [...new Set(this.books.map((book) => book.category))];
    this.mostReadBooks = [...this.books]
      .sort((a, b) => b.readCount - a.readCount)
      .slice(0, 10);
  }

  showAllBooks(category: string) {
    // Implémenter la navigation vers la vue complète de la catégorie
  }

  ngOnInit() {
    this.filteredBooks = this.books;
  }

  generateMockData() {
    const categories = [
      'Roman',
      'Science-Fiction',
      'Policier',
      'Biographie',
      'Essai',
    ];
    const books: Book[] = [];

    for (let i = 1; i <= 100; i++) {
      books.push({
        id: i,
        title: `Livre ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        description: `Une courte description du livre ${i}...`,
        coverUrl: `https://placehold.co/200x400`,
        progress:
          Math.random() > 0.5 ? Math.floor(Math.random() * 100) : undefined,
        isFavorite: Math.random() > 0.8,
        readCount: Math.floor(Math.random() * 1000),
      });
    }

    this.books = books;
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(this.books));
  }

  getBooksByCategory(category: string): Book[] {
    return this.filteredBooks.filter((book) => book.category === category);
  }

  filterBooks() {
    if (!this.searchTerm.trim()) {
      this.filteredBooks = this.books;
      return;
    }

    this.filteredBooks = this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleFavorite(book: Book) {
    book.isFavorite = !book.isFavorite;
    this.saveToLocalStorage();
  }

  readBook(book: Book) {
    // À implémenter : redirection vers la visionneuse PDF
    console.log(`Redirection vers le livre : ${book.title}`);
  }
}
