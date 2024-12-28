import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.scss'],
})
export class SiderbarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log();
  }
  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Implémente la logique de déconnexion ici
      console.log('Déconnecté');
      this.router.navigate(['/login']); // Redirige vers la page de login
    }
  }
}
