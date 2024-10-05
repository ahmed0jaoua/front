import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

 

  private apiUrl = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) { }
/*
  createCommande(commandeData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, commandeData);
  }*/
    createCommande(commandeData: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/createCommande`, commandeData);}

      
  getCommandes(): Observable<any[]> {
    return this.http.get<any[]>("http://127.0.0.1:8000/listCommandes");
  }

  getCommandeById(id: number): Observable<any> {
    console.log(id)
    return this.http.get<any>(`${this.apiUrl}/findByCommande/${id}`);
  }


}
