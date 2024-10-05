import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
@Injectable({
  providedIn: 'root'
})
export class BonlivraisonService {

  glob_API = GlobalComponent.API_URL;


  constructor(private http: HttpClient) { }


  getLivraisons(): Observable<any[]> {
    return this.http.get<any[]>(this.glob_API + "livraisons");
  }
  getStatistiques(): Observable<any[]> {
    return this.http.get<any[]>(this.glob_API + "statistiques");
  }


  findListLigneAndtrajetParIdLivraison(id: number): Observable<any[]> {

    return this.http.get<any[]>(`${this.glob_API}livraison/details/${id}`);
  }

  findLivraisonById (id: number): Observable<any> {
    console.log(id)
    return this.http.get<any>(`${this.glob_API}livraison/${id}`);
  }
  findLivraisonByIdClient (id: number |null): Observable<any> {
    console.log(id)
    return this.http.get<any>(`${this.glob_API}getLivraisonParIdClient/${id}`);
  } 

  updateLivraison(LivraisonData: any, id: number | null): Observable<any> {
    console.log(id);
    return this.http.post<any>(`${this.glob_API}livraison/update/${id}`, LivraisonData);
  }

  getLivraisonBysite(id: number) {

    return this.http.get<any[]>(this.glob_API + 'fichederoute/' + id);

  }

  changeEtatDuFicheRoute(id: number | null, etat: any) {

    return this.http.post<any[]>(this.glob_API + 'changerEtatFicheDeRoute/' + id, etat);
  }

  createFicheDeRoute(ficheDeRoute: any): Observable<any> {

    const url = this.glob_API + 'create-fiche-du-route';

    return this.http.post<any>(url, ficheDeRoute);
  }


  deleteFicheDEroute(id: number): Observable<any> {
    return this.http.delete<any>(`${this.glob_API}delete-fiche-du-route/${id}`);
  }


  getFicheDeRoute(id: number | null): Observable<any[]> {
    return this.http.get<any[]>(this.glob_API + "ListeficheDeRoutes/" + id);
  }
  gerFicheEntrant(id: number | null): Observable<any[]> {
    return this.http.get<any[]>(this.glob_API + "ListeficheDeRoutesEntrant/" + id);
  }



  getTrajetbyficheDeRoute(id: number | null) {

    return this.http.get<any[]>(this.glob_API + 'fiche-du-route/trajets/' + id);
  }

  getficheDeRoutebyId(id: number | null) {

    return this.http.get<any[]>(this.glob_API + 'fichederoutedetails/' + id);
  }

  getArticleByFicheDeRoute(id: number | null) {

    return this.http.get<any[]>(this.glob_API + 'livraison/parficheRoute/' + id);
  }











  updateStatutArticle(statusArticle: any): Observable<any> {

    return this.http.post<any>(`${this.glob_API}livraison/update-trajet-status`, statusArticle);
  }
  updateLivraisonStatus(statusArticle: any): Observable<any> {

    return this.http.post<any>(`${this.glob_API}livraison/update-livraison-status`, statusArticle);
  }

  getArticlesByClient(id: number) {

    return this.http.get<any[]>(this.glob_API + ' articles/client/' + id);
  }






  createbon(clientData: any): Observable<any> {


    const url = this.glob_API + 'livraison/create';
    return this.http.post<any>(url, clientData);
  }
  getAllBonDeLivraison(): Observable<any[]> {
    return this.http.get<any[]>(`${this.glob_API}api/bonlivraison`);
  }

  getBonDeLivraisonById(id: number): Observable<any> {
    return this.http.get<any>(`${this.glob_API}api/bonlivraison/${id}`);
  }

  getBonLivraisonCount(): Observable<any> {
    return this.http.get<any>(`${this.glob_API}totalbon`);
  }


  findBonById(id: number): Observable<any> {
    console.log(id)
    return this.http.get<any>(`${this.glob_API}bonlivraison/${id}`);
  }

  findArticleByIdBon(id: number): Observable<any> {

    return this.http.get<any>(`${this.glob_API}api/articlesbonlivraison/${id}`);
  }
  findarBybon(id: number): Observable<any> {
    console.log(id)
    return this.http.get<any>(`${this.glob_API}api/articlesbonlivraison/${id}`);
  }

}
