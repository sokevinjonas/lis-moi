import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { Books } from 'src/app/core/interfaces/books';
import { GlobalService } from 'src/app/core/services/global/global.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.page.html',
  styleUrls: ['./searchbar.page.scss'],
})
export class SearchbarPage implements OnInit {
  @ViewChild('searchbar', { static: false }) searchbar!: IonSearchbar;
  searchTerm: string = '';
  showHistory: boolean = false;
  filteredBooks: Books[] = [];
  searchHistory: string[] = [];
  suggestions: any[] = []; // Suggestions basées sur le terme saisi

  constructor(private route: Router, protected globalService: GlobalService) {}

  ngOnInit() {
    this.globalService.loadBooks();
    this.loadSearchHistory();
    setTimeout(() => {
      this.searchbar.value = '';
      this.searchbar.setFocus();
    }, 300);
  }

  loadSearchHistory() {
    const storedHistory = localStorage.getItem('search_history');
    this.searchHistory = storedHistory ? JSON.parse(storedHistory) : [];
  }

  onSearchFocus() {
    this.showHistory = true;
    this.loadSearchHistory();
  }

  comeBack() {
    this.route.navigate(['tabs/tab1']);
  }

  performSearch(event?: KeyboardEvent): void {
    if (event && event.key !== 'Enter') {
      // Si ce n'est pas la touche "Entrée", on ne fait rien
      return;
    }

    if (!this.searchTerm) {
      this.filteredBooks = [];
      this.suggestions = [];
      return;
    }

    if (this.searchTerm.length >= 4) {
      console.log(this.searchTerm);

      // Filtrer les livres en fonction du titre ou de la catégorie
      this.filteredBooks = this.globalService.books.filter((book) =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      // Mettre à jour les suggestions uniquement basées sur le titre
      this.suggestions = this.globalService.books.filter((book) =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      // Si des résultats existent, ajouter le terme de recherche à l'historique
      if (this.filteredBooks.length > 0) {
        this.addToSearchHistory(this.searchTerm);
      }
    }
  }

  private addToSearchHistory(term: string): void {
    const cleanTerm = term.trim().toLowerCase();

    // Supprimer les doublons
    this.searchHistory = this.searchHistory.filter(
      (search) => search.toLowerCase() !== cleanTerm
    );

    // Ajouter au début de l'historique
    this.searchHistory.unshift(term);

    // Limiter à 5 recherches
    if (this.searchHistory.length > 3) {
      this.searchHistory = this.searchHistory.slice(0, 3);
    }

    // Sauvegarder dans le localStorage
    localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
  }

  useHistorySearch(historicalSearch: string) {
    this.searchTerm = historicalSearch;
    this.performSearch();
    this.showHistory = false;
  }

  clearSearchHistory() {
    this.searchHistory = [];
    this.searchbar.value = '';
    localStorage.removeItem('search_history');
  }
  truncateTitle(title: string, maxLength: number = 60): string {
    if (!title) return '';
    return title.length > maxLength
      ? title.substring(0, maxLength) + '...'
      : title;
  }
}
