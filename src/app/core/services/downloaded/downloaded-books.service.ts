import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { BehaviorSubject, Observable } from 'rxjs';
import { Books } from '../../interfaces/books';
import { GlobalService } from '../global/global.service';

interface DownloadedBook extends Books {
  filePath: string;
  downloadDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DownloadedBooksService {
  private readonly STORAGE_KEY = 'downloaded_books';
  private readonly DOWNLOAD_DIR = 'Lis-moi';
  private downloadedBooks = new BehaviorSubject<DownloadedBook[]>([]);

  constructor(protected globalService: GlobalService) {
    this.loadDownloadedBooks();
  }

  async loadDownloadedBooks(): Promise<DownloadedBook[]> {
    const books = await this.getBooksFromStorage();
    this.globalService.loadBooks();
    this.downloadedBooks.next(books);
    return books;
  }
  private async getBooksFromStorage(): Promise<DownloadedBook[]> {
    const storedBooks = localStorage.getItem(this.STORAGE_KEY);
    return storedBooks ? JSON.parse(storedBooks) : [];
  }

  public addDownloadedBook(book: Books, filePath: string): void {
    const downloadedBook: DownloadedBook = {
      ...book,
      filePath,
      downloadDate: new Date(),
    };

    const currentBooks = this.downloadedBooks.value;
    const updatedBooks = [...currentBooks, downloadedBook];

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedBooks));
    this.downloadedBooks.next(updatedBooks);

    console.log('Livre ajouté aux téléchargements:', downloadedBook);
  }

  public async removeDownloadedBook(book: Books): Promise<void> {
    try {
      const fileName = this.getFileName(book);

      await Filesystem.deleteFile({
        path: `${this.DOWNLOAD_DIR}/${fileName}`,
        directory: Directory.Documents,
      });

      const updatedBooks = this.downloadedBooks.value.filter(
        (b) => b.id !== book.id
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedBooks));
      this.downloadedBooks.next(updatedBooks);

      console.log(`Livre supprimé : ${fileName}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du livre:', error);
    }
  }

  public getDownloadedBooks(): Observable<DownloadedBook[]> {
    return this.downloadedBooks.asObservable();
  }

  public isBookDownloaded(bookId: number): boolean {
    return this.downloadedBooks.value.some((book) => book.id === bookId);
  }

  private getFileName(book: Books): string {
    return `${book.title.toLowerCase().replace(/[^a-z0-9]/gi, '-')}_${
      book.id
    }.pdf`;
  }
}
