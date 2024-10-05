import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { GlobalComponent } from 'src/app/global-component';
//import { User } from '../models/auth.models';
import { Observable } from 'rxjs';
const API_URL = GlobalComponent.API_URL + 'site';

@Injectable({ providedIn: 'root' })
export class SiegeService {

  constructor(private http: HttpClient) { }
  /***
   * Get All User
   */





  getSieges(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + '/liste');
  }
  getSiegesparIdUTilisateur(id: any): Observable<any[]> {
    return this.http.get<any[]>(API_URL + `s/user/${id}`);
  }



  createSiege(siegeData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(API_URL + '/addsite', siegeData, { headers });
  }


  updateSiege(id: number, siegeData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });


    return this.http.put<any>(API_URL + '/updatesite/' + id, siegeData, { headers });
  }

  deleteSiege(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.delete<any>(API_URL + '/deletesite/' + id, { headers });
  }





  /***
   * Facked User Register
   */

}
