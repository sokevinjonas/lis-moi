import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';
import { Books } from 'src/app/core/interfaces/books';
import { GlobalService } from 'src/app/core/services/global/global.service';
import { NgxExtendedPdfViewerComponent } from 'ngx-extended-pdf-viewer'; // Importer le composant PDF

@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
})
export class ReaderPage implements OnInit, AfterViewInit {
  @ViewChild(NgxExtendedPdfViewerComponent)
  pdfViewer!: NgxExtendedPdfViewerComponent; // Ajouter la référence au composant PDF

  bookID!: number;
  book!: Books;
  currentPage: number = 0;
  totalPages: number = 0;
  progressValue: number = 0; // Progression sous forme de ratio (ex: 0.5 pour 50%)
  isBookmarked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    protected globalService: GlobalService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.bookID = Number(this.route.snapshot.paramMap.get('bookID'));

    // Charger les détails du livre
    this.globalService.loadItemBook(this.bookID).subscribe({
      next: (data) => {
        this.book = data.data[0];
        console.log('Détail du livre reçu:', this.book);

        // Charger la progression du livre depuis localStorage
        this.loadProgress();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du livre:', error);
      },
    });
  }

  ngAfterViewInit() {
    // Après que le composant PDF est chargé, on définit la page initiale
    setTimeout(() => {
      this.setInitialPage();
    }, 2000); // Attendre que le PDF soit chargé avant de restaurer la page
  }

  onPdfLoaded(event: any) {
    console.log('Événement pdfLoaded:', event);
    if (event.pagesCount) {
      this.totalPages = event.pagesCount;
      this.progressValue = this.currentPage / this.totalPages;
      console.log(`Nombre total de pages: ${this.totalPages}`);

      // Restaurer la page initiale après le chargement du PDF
      this.setInitialPage();
    } else {
      console.warn('Le nombre de pages n’a pas pu être récupéré.');
    }
  }

  // Méthode pour définir la page initiale après le chargement du PDF
  setInitialPage() {
    if (this.currentPage > 0 && this.pdfViewer) {
      // Naviguer à la page sauvegardée via l'instance du composant PDF
      this.pdfViewer.page = this.currentPage;
      console.log(`Navigué à la page sauvegardée: ${this.currentPage}`);
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.progressValue = page / this.totalPages;

    // Sauvegarder la progression
    this.saveProgress();
  }

  // Sauvegarde de la progression dans le localStorage
  saveProgress() {
    const progressData = JSON.parse(
      localStorage.getItem('readingProgress') || '{}'
    );
    progressData[this.bookID] = {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      progress: Math.round(this.progressValue * 100), // Sauvegarder en pourcentage
    };
    localStorage.setItem('readingProgress', JSON.stringify(progressData));
  }

  // Chargement de la progression à partir du localStorage
  loadProgress() {
    const progressData = JSON.parse(
      localStorage.getItem('readingProgress') || '{}'
    );
    if (progressData[this.bookID]) {
      const savedProgress = progressData[this.bookID];
      this.currentPage = savedProgress.currentPage || 0;
      this.progressValue = savedProgress.progress / 100 || 0;

      // Afficher la progression chargée dans la console pour vérification
      console.log(
        `Progression chargée : Page ${this.currentPage} sur ${this.totalPages}`
      );
    }
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
