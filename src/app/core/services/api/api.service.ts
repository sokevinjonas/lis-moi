import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../../interfaces/category';

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
  /*
    Endpoints poour index/show
  */
  getDataBooks(): Observable<any> {
    return this.http.get<any>(`${this.api}books`);
  }
  getItemBook(params: number): Observable<any> {
    return this.http.get<any>(`${this.api}books/${params}`);
  }

  getDataCategories(): Observable<any> {
    return this.http.get<any>(`${this.api}categories`);
  }

  /*
    Endpoints poour store/updates
  */
  storeDataCatory(catory: Category): Observable<any> {
    return this.http.post<any>(`${this.api}/categories`, catory);
  }
}
