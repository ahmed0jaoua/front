import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { GlobalComponent } from 'src/app/global-component';
//import { User } from '../models/auth.models';
import { Observable } from 'rxjs';
const API_URL = GlobalComponent.API_URL + 'chauffeur/';

@Injectable({ providedIn: 'root' })
export class ChauffeurService {

  constructor(private http: HttpClient) { }
  /***
   * Get All User
   */


  getChauffeur(id: number | null): Observable<any> {
    const url = `${API_URL}${id}`;
    return this.http.get<any>(url);
  }
    getLivraisonParChauffeur(id: number | null): Observable<any> {
    const url = `${API_URL}getLivraisonParIdChauffer/${id}`;
    return this.http.get<any>(url);
  }




  getChauffeurs(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + 'liste');
  }

  getchauffeurparstatut(chauffeurdata: any): Observable<any[]> {
    return this.http.post<any[]>(API_URL + 'liste/statut', chauffeurdata);
  }
  // Create a new client
  createChauffeur(vehiculeData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(API_URL + 'create', vehiculeData, { headers });
  }

  // Update an existing client
  updateChauffeur(id: number, chauffeurData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(chauffeurData);

    return this.http.put<any>(API_URL + 'update/' + id, chauffeurData, { headers });
  }
  uploadChauffeurFiles(chauffeurId: number, formData: FormData) {
    return this.http.post(`${API_URL}${chauffeurId}/upload-files`, formData)
    .pipe(
      catchError(this.handleError)
    );
  }
  uploadChauffeurPhoto(chauffeurId: number, formData: FormData) {
    return this.http.post(`${API_URL}${chauffeurId}/uploadPhotoo`, formData)
    
  }

  getChauffeurFiles(chauffeurId: number): Observable<any> {
    return this.http.get(`${API_URL}${chauffeurId}/files`);
  }
  downloadFile(fileName: string): any {
    const url = `${API_URL}download/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  deleteChauffeurFile(chauffeurId: number, fileId: number): Observable<any> {
    return this.http.delete(`${API_URL}${chauffeurId}/delete-file/${fileId}`);
  }
   
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    return throwError(() => errorMessage);
  }
  /***
   * Facked User Register
   */

}
