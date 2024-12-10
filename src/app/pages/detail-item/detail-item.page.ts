import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Directory, Filesystem, WriteFileOptions } from '@capacitor/filesystem';
import { ToastController } from '@ionic/angular';
import { Books } from 'src/app/core/interfaces/books';
import { DownloadedBooksService } from 'src/app/core/services/downloaded/downloaded-books.service';
import { GlobalService } from 'src/app/core/services/global/global.service';

@Component({
  selector: 'app-detail-item',
  templateUrl: './detail-item.page.html',
  styleUrls: ['./detail-item.page.scss'],
})
export class DetailItemPage implements OnInit {
  bookID!: number;
  book!: Books;

  constructor(
    private route: ActivatedRoute,
    protected globalService: GlobalService,
    private http: HttpClient,
    private toastController: ToastController,
    protected downloadedBooksService: DownloadedBooksService
  ) {}

  ngOnInit() {
    this.globalService.loadFromLocalStorage();
    this.bookID = Number(this.route.snapshot.paramMap.get('bookID'));
    this.globalService.loadItemBook(this.bookID).subscribe({
      next: (data) => {
        this.book = data.data[0];
        console.log('Détail du livre reçu:', this.book);
        this.globalService.loadProgressForBook(this.book.id);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du livre:', error);
      },
    });
  }

  async downloadBook() {
    try {
      if (!this.book || !this.book.url) {
        const toast = await this.toastController.create({
          message: 'Aucun fichier disponible au téléchargement',
          duration: 3000,
          color: 'warning',
        });
        await toast.present();
        return;
      }

      if (this.downloadedBooksService.isBookDownloaded(this.book.id)) {
        const toast = await this.toastController.create({
          message: 'Ce livre est déjà téléchargé.',
          duration: 3000,
          color: 'warning',
        });
        await toast.present();
        return;
      }

      const fileExtension = this.book.url.split('.').pop() || 'pdf';
      const sanitizedFileName = this.book.title
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/-+/g, '-')
        .trim();
      const fileName = `${sanitizedFileName}_${Date.now()}.${fileExtension}`;

      const response = await this.http
        .get(this.book.url, { responseType: 'blob' })
        .toPromise();

      if (!response) {
        throw new Error('Échec du téléchargement du fichier');
      }

      const base64Data = await this.blobToBase64(response);

      await Filesystem.mkdir({
        path: 'Lis-moi',
        directory: Directory.Documents,
        recursive: true,
      });

      const writeOptions: WriteFileOptions = {
        path: `Lis-moi/${fileName}`,
        directory: Directory.Documents,
        data: base64Data as string,
        recursive: true,
      };

      await Filesystem.writeFile(writeOptions);

      this.downloadedBooksService.addDownloadedBook(
        this.book,
        writeOptions.path
      );

      const toast = await this.toastController.create({
        message: `Le livre a été téléchargé dans Lis-moi/${fileName}`,
        duration: 3000,
        position: 'bottom',
      });
      await toast.present();
    } catch (error) {
      console.error('Erreur de téléchargement', error);
      const toast = await this.toastController.create({
        message: 'Échec du téléchargement',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  private blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
