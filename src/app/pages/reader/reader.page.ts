import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';
import { Books } from 'src/app/core/interfaces/books';
import { GlobalService } from 'src/app/core/services/global/global.service';
@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
})
export class ReaderPage implements OnInit {
  bookID!: number;
  book!: Books;
  currentPage: number = 0;
  totalPages: number = 0;
  progressValue: number = 0;
  isBookmarked: boolean = false;
  constructor(
    private route: ActivatedRoute,
    protected globalService: GlobalService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.bookID = Number(this.route.snapshot.paramMap.get('bookID'));

    this.globalService.loadItemBook(this.bookID).subscribe({
      next: (data) => {
        this.book = data.data[0];
        console.log('Détail du livre reçu:', this.book); // À cet endroit, les données sont prêtes
      },
      error: (error) => {
        console.error('Erreur lors du chargement du livre:', error);
      },
    });
  }
  onPdfLoaded(event: any) {
    this.totalPages = event.numPages;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.progressValue = page / this.totalPages;
  }

  async toggleBookmark() {
    this.isBookmarked = !this.isBookmarked;
    const message = this.isBookmarked
      ? 'Marque-page ajouté'
      : 'Marque-page retiré';

    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  async shareBook() {
    try {
      await Share.share({
        title: this.book.title,
        text: `Je te recommande ce livre: ${this.book.title}`,
        url: this.book.url,
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  }
}
