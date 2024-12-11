import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { BehaviorSubject, Observable } from 'rxjs';
import { Books } from '../../interfaces/books';

interface DownloadedBook extends Books {
  filePath: string; // Chemin du fichier local
  downloadDate: Date; // Date du téléchargement
}

@Injectable({
  providedIn: 'root',
})
export class DownloadedBooksService {
  private readonly STORAGE_KEY = 'downloaded_books';
  private readonly DOWNLOAD_DIR = 'Lis-moi';
  private downloadedBooks = new BehaviorSubject<DownloadedBook[]>([]);

  constructor() {
    this.loadDownloadedBooks(); // Charge les livres téléchargés au démarrage
  }

  /**
   * Charge les livres téléchargés depuis le stockage local.
   */
  async loadDownloadedBooks(): Promise<DownloadedBook[]> {
    const books = await this.getBooksFromStorage();
    console.log(
      ' Charge les livres téléchargés depuis le stockage local.',
      books
    );

    this.downloadedBooks.next(books);
    return books; // Retourne les livres téléchargés
  }

  /**
   * Récupère les livres depuis le localStorage.
   */
  async getBooksFromStorage(): Promise<DownloadedBook[]> {
    const storedBooks = localStorage.getItem(this.STORAGE_KEY);
    return storedBooks ? JSON.parse(storedBooks) : [];
  }

  /**
   * Ajoute un livre téléchargé et met à jour le stockage.
   */
  addDownloadedBook(book: Books, filePath: string): void {
    const downloadedBook: DownloadedBook = {
      ...book,
      filePath,
      downloadDate: new Date(),
    };

    const updatedBooks = [...this.downloadedBooks.value, downloadedBook];
    this.updateBooksInStorage(updatedBooks);

    console.log('Livre ajouté aux téléchargements :', downloadedBook);
  }

  /**
   * Supprime un livre téléchargé et met à jour le stockage.
   */
  async removeDownloadedBook(book: Books): Promise<void> {
    try {
      console.log('Tentative de suppression du livre :', book);

      const directoryPath = 'Lis-moi';
      const filePath = `${directoryPath}/${this.getFileName(book)}`;
      console.log('Vérification du chemin du fichier :', filePath);
      // Vérifiez si le fichier existe
      try {
        await Filesystem.stat({
          path: filePath,
          directory: Directory.Documents,
        });
      } catch {
        console.warn(
          `Le fichier ${filePath} n'existe pas, suppression ignorée.`
        );
      }

      // Supprimez le fichier
      await Filesystem.deleteFile({
        path: filePath,
        directory: Directory.Documents,
      });

      // Mettez à jour la liste locale
      const updatedBooks = this.downloadedBooks.value.filter(
        (b) => b.id !== book.id
      );
      this.updateBooksInStorage(updatedBooks);

      console.log(`Livre supprimé : ${book.title}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du livre :', error);
    }
  }

  /**
   * Vérifie si un livre est déjà téléchargé.
   */
  isBookDownloaded(bookId: number): boolean {
    return this.downloadedBooks.value.some((book) => book.id === bookId);
  }

  /**
   * Retourne la liste observable des livres téléchargés.
   */
  getDownloadedBooks(): Observable<DownloadedBook[]> {
    return this.downloadedBooks.asObservable();
  }

  /**
   * Génère un nom de fichier unique pour le livre.
   */
  getFileName(book: Books): string {
    return `${book.title.toLowerCase().replace(/[^a-z0-9]/gi, '-')}_${
      book.id
    }.pdf`;
  }

  /**
   * Met à jour la liste des livres téléchargés dans le localStorage et le BehaviorSubject.
   */
  updateBooksInStorage(books: DownloadedBook[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
    this.downloadedBooks.next(books);
  }
}
