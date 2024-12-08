import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Books } from 'src/app/core/interfaces/books';
import { GlobalService } from 'src/app/core/services/global/global.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
})
export class ReaderPage implements OnInit {
  bookID!: number;
  bookUrl!: string;
  constructor(
    private route: ActivatedRoute,
    protected globalService: GlobalService
  ) {}

  async ngOnInit() {
    this.bookID = Number(this.route.snapshot.paramMap.get('bookID'));

    try {
      const book = await this.globalService.loadItemBook(this.bookID);
      console.log('Book Object:', book); // Vérifie l'objet complet retourné
      this.bookUrl = book.url; // Assigne l'URL
      console.log('Book URL:', this.bookUrl); // Vérifie l'URL
    } catch (error) {
      console.error('Erreur lors du chargement du livre:', error);
    }
  }
}
