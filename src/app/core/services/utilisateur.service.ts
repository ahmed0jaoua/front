import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {



  glob_API = GlobalComponent.API_URL;


  constructor(private http: HttpClient) { }
  getAllUtil(): Observable<any[]> {
    return this.http.get<any[]>(`${this.glob_API}usersff`);
  }

  login1 (logindata :any): Observable<any[]> {
    return this.http.post<any>(`${this.glob_API}login`, logindata);
  }

  
  createUtilisateur(utilisateurdata: any): Observable<any> {
    return this.http.post<any>(`${this.glob_API}register`, utilisateurdata);
  }
  
  updateUtilisateur(utilisateurdata: any,id:number): Observable<any> {
    return this.http.post<any>(`${this.glob_API}updateUser/${id}`, utilisateurdata);
  }
  deleteUtilisateur(id:number): Observable<any> {
    return this.http.delete<any>(`${this.glob_API}deleteUser/${id}`);
  }


}
