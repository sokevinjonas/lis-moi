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

  async downloadBook(book: Books) {
    if (this.globalService.isDownloading) {
      const toast = await this.toastController.create({
        message: 'Un téléchargement est déjà en cours, veuillez patienter.',
        duration: 3000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    this.globalService.isDownloading = true;

    try {
      // Vérifiez si le livre est valide
      if (!book || !book.url) {
        const toast = await this.toastController.create({
          message: 'Aucun fichier disponible au téléchargement.',
          duration: 3000,
          color: 'warning',
        });
        await toast.present();
        return;
      }

      // Vérifiez si le livre est déjà téléchargé
      if (this.downloadedBooksService.isBookDownloaded(book.id)) {
        const toast = await this.toastController.create({
          message: 'Ce livre a déjà été téléchargé.',
          duration: 3000,
          color: 'warning',
        });
        await toast.present();
        return;
      }

      console.log('Téléchargement depuis l’URL :', book.url);

      const response = await this.http
        .get(book.url, { responseType: 'blob' })
        .toPromise()
        .catch((error) => {
          console.error('Erreur HTTP lors du téléchargement :', error);
          throw new Error(
            'Impossible de récupérer le fichier depuis le serveur.'
          );
        });

      if (!response || !(response instanceof Blob)) {
        throw new Error('Le fichier téléchargé est invalide ou introuvable.');
      }

      const fileExtension = book.url.split('.').pop() || 'pdf';
      const sanitizedFileName = book.title
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/-+/g, '-')
        .trim();
      const fileName = `${sanitizedFileName}_${Date.now()}.${fileExtension}`;

      const base64Data = await this.blobToBase64(response);

      const directoryPath = 'Lis-moi';
      try {
        await Filesystem.stat({
          path: directoryPath,
          directory: Directory.Documents,
        });
        console.log(`Le répertoire ${directoryPath} existe déjà.`);
      } catch {
        console.log(
          `Le répertoire ${directoryPath} n'existe pas, création en cours.`
        );
        await Filesystem.mkdir({
          path: directoryPath,
          directory: Directory.Documents,
          recursive: true,
        });
      }

      const writeOptions = {
        path: `${directoryPath}/${fileName}`,
        directory: Directory.Documents,
        data: base64Data as string,
        recursive: true,
      };

      await Filesystem.writeFile(writeOptions);

      // Enregistrez le livre comme téléchargé
      this.downloadedBooksService.addDownloadedBook(book, writeOptions.path);
      this.downloadedBooksService.loadDownloadedBooks();
      const toast = await this.toastController.create({
        message: `Le livre a été téléchargé dans ${directoryPath}/${fileName}`,
        duration: 3000,
        position: 'bottom',
      });
      await toast.present();
    } catch (error) {
      console.error('Erreur de téléchargement :', error);
      const toast = await this.toastController.create({
        message: 'Échec du téléchargement.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.globalService.isDownloading = false;
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
