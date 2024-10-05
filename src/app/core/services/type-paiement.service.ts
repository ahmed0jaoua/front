import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
@Injectable({
  providedIn: 'root'
})
export class TypePaiementService {

  private glob_API = `${GlobalComponent.API_URL}typepaiement`;
 

  constructor(private http: HttpClient) { }
  

  
  getTypePaiement(): Observable<any[]> {
    return this.http.get<any[]>(`${this.glob_API}/liste`);
  }
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.glob_API}/get/${id}`);
  }

  
  add(typeColis: any): Observable<any> {
    return this.http.post<any>(`${this.glob_API}/ajouter`, typeColis);
  }

  
  update(id: number, typeColis: any): Observable<any> {
    return this.http.put<any>(`${this.glob_API}/modifier/${id}`, typeColis);
  }

  
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.glob_API}/supprimer/${id}`);
  }

}
