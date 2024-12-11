import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Books } from '../core/interfaces/books';
import { DownloadedBooksService } from '../core/services/downloaded/downloaded-books.service';
import { GlobalService } from '../core/services/global/global.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  downloadedBooks: Books[] = [];
  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    protected downloadedBookService: DownloadedBooksService,
    protected globalService: GlobalService
  ) {}
  ngOnInit() {
    this.downloadedBookService.loadDownloadedBooks().then((books) => {
      this.downloadedBooks = books;
      console.log(this.downloadedBooks);
    });
  }

  async removeBook(book: Books) {
    const alert = await this.alertController.create({
      header: 'Confirmer la suppression',
      message: 'Voulez-vous vraiment supprimer ce livre téléchargé ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          handler: async () => {
            try {
              await this.downloadedBookService.removeDownloadedBook(book);
              const toast = await this.toastController.create({
                message: 'Livre supprimé avec succès',
                duration: 2000,
                color: 'success',
              });
              await toast.present();
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              const toast = await this.toastController.create({
                message: 'Erreur lors de la suppression du livre',
                duration: 3000,
                color: 'danger',
              });
              await toast.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
