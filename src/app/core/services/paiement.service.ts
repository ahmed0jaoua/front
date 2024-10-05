import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  glob_API = GlobalComponent.API_URL;
  constructor(private http: HttpClient) { }


  ajouterpaiment(clientData: any): Observable<any> {

    const url = this.glob_API + 'paiement/create';
    return this.http.post<any>(url, clientData);
  }
  getPaiements(id: number): Observable<any> {
    const url = this.glob_API + 'paiement/by-livraison/' + id;
    return this.http.get<any>(url);
  }

  getPaiementsFacture(id: number): Observable<any> {
    const url = this.glob_API + 'paiement/by-livraison/' + id;
    return this.http.get<any>(url);
  }

  ajouterMultiplepaiment(clientData: any): Observable<any> {

    const url = this.glob_API + 'paiement/createMultiple';
    return this.http.post<any>(url, clientData);
  }

  getAllPaiements(): Observable<any> {
    const url = this.glob_API + 'paiement/all';
    return this.http.get<any>(url);
  }
  ajouterpaimentFacture(clientData: any): Observable<any> {

    const url = this.glob_API + 'paiement/createfacture';
    return this.http.post<any>(url, clientData);
  }

}
