import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';

const API_URL = GlobalComponent.API_URL + 'facture/';
const API=  GlobalComponent.API_URL ;
@Injectable({
  providedIn: 'root'
})
export class FactureService {

  constructor(private http: HttpClient) { }

  // Get all factures
  getAllFactures(): Observable<any[]> {
    return this.http.get<any[]>(API_URL);
  }

  // Get a facture by ID
  getFactureById(id: number  |null ): Observable<any> {
    return this.http.get<any>(API_URL+ id);
  }

   getFactureByIdClient(id: number  |null ): Observable<any> {
    return this.http.get<any>(API_URL +'client/'+ id);
  }


  createFacture(factureData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(API_URL + 'create', factureData, { headers });
  }

  // Update an existing facture by ID
  updateFacture(id: number, factureData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(API_URL + 'update/' + id, factureData, { headers });
  }

  // Delete a facture by ID
  deleteFacture(id: number): Observable<any> {
    return this.http.delete<any>(API_URL + 'delete/' + id);
  }

  // Example method you already have
  getLivraisonTermine(): Observable<any[]> {
    return this.http.get<any[]>(API + 'livraisonsTerminé');
  }
}
