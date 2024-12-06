import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  user: any = {
    name: 'John Doe',
    email: 'john@example.com',
    photoUrl: 'assets/avatar.jpg',
    booksRead: 12,
    totalPages: 2459,
    favorites: 8,
  };
  constructor() {}

  editProfile() {
    // Navigation vers la page d'édition du profil
  }

  openReadingHistory() {
    // Navigation vers l'historique de lecture
  }

  openDownloads() {
    // Navigation vers les téléchargements
  }

  openNotificationSettings() {
    // Navigation vers les paramètres de notification
  }

  openAppSettings() {
    // Navigation vers les paramètres de l'application
  }

  async logout() {
    // Navigation vers la page de connexion
  }
}
