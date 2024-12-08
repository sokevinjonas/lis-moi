import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api: string;
  isProd: Boolean = false;

  constructor(private http: HttpClient) {
    // Déterminer l'URL de l'API en fonction de l'environnement
    this.api = environment.production ? environment.api : environment.api;
  }

  getDataBooks(): Observable<any> {
    return this.http.get<any>(`${this.api}books`);
  }
  getDataCategories(): Observable<any> {
    return this.http.get<any>(`${this.api}categories`);
  }
}
