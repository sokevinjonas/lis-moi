import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  favoriteBooks: any[] = [
    {
      id: '1',
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      coverUrl: 'https://placehold.co/400',
      description:
        "Un prince venu d'une autre planète raconte ses aventures à un aviateur.",
      progress: 75,
      pageCount: 96,
      category: 'Roman classique',
      lastRead: '2024-03-15',
      isFavorite: true,
    },
    {
      id: '2',
      title: "Harry Potter à l'école des sorciers",
      author: 'J.K. Rowling',
      coverUrl: 'https://placehold.co/400',
      description:
        'Un jeune sorcier découvre ses pouvoirs et un nouveau monde magique.',
      progress: 100,
      pageCount: 305,
      category: 'Fantasy',
      lastRead: '2024-02-28',
      isFavorite: true,
    },
    {
      id: '3',
      title: 'Les Misérables',
      author: 'Victor Hugo',
      coverUrl: 'https://placehold.co/400',
      description: "L'histoire de Jean Valjean dans le Paris du 19ème siècle.",
      progress: 45,
      pageCount: 1488,
      category: 'Roman classique',
      lastRead: '2024-03-10',
      isFavorite: true,
    },
    {
      id: '4',
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://placehold.co/400',
      description:
        'Une épopée de science-fiction sur la planète désertique Arrakis.',
      progress: 60,
      pageCount: 612,
      category: 'Science-fiction',
      lastRead: '2024-03-01',
      isFavorite: true,
    },
    {
      id: '5',
      title: "L'Étranger",
      author: 'Albert Camus',
      coverUrl: 'https://placehold.co/400',
      description:
        "L'histoire de Meursault, un homme indifférent face à la société.",
      progress: 90,
      pageCount: 184,
      category: 'Roman philosophique',
      lastRead: '2024-03-12',
      isFavorite: true,
    },
  ];
  constructor() {}
  async loadFavorites() {
    // Dans un cas réel, on chargerait les données depuis le service
    // this.favoriteBooks = await this.bookService.getFavoriteBooks();
  }

  getTotalPages() {
    return this.favoriteBooks.reduce(
      (total, book) => total + (book.pageCount * (book.progress || 0)) / 100,
      0
    );
  }

  readBook(book: any) {}

  removeFavorite(book: any) {
    this.favoriteBooks = this.favoriteBooks.filter((b) => b.id !== book.id);
  }
}
