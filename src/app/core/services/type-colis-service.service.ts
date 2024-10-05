import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';

@Injectable({
  providedIn: 'root',
})
export class TypeColisService {
  private apiUrl = `${GlobalComponent.API_URL}typecolis`;

  constructor(private http: HttpClient) {}

  // Get all TypeColis
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }

  // Get TypeColis by ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }

  // Add new TypeColis
  add(typeColis: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ajouter`, typeColis);
  }

  // Update existing TypeColis
  update(id: number, typeColis: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/modifier/${id}`, typeColis);
  }

  // Delete TypeColis
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/supprimer/${id}`);
  }
}
