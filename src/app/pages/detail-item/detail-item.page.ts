import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Books } from 'src/app/core/interfaces/books';
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
    protected globalService: GlobalService
  ) {}

  ngOnInit() {
    // Récupérer l'ID du livre à partir de l'URL
    this.bookID = Number(this.route.snapshot.paramMap.get('bookID'));

    // Charger les détails du livre depuis le service
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
}
