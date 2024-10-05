import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';

const API_URL = GlobalComponent.API_URL ;
@Injectable({
  providedIn: 'root'
})


export class StatistiqueService {

  constructor(private http: HttpClient) { }

    getLivraisonParYear(annee: any): Observable<any[]> {
      return this.http.get<any[]>(API_URL + `livraisons-by-month/${annee}`);
    }


    getStatistiques(): Observable<any[]> {
      return this.http.get<any[]>(API_URL + "statistiques");
    }
  
  
   }

