import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';


import { GlobalComponent } from 'src/app/global-component';
//import { User } from '../models/auth.models';
import { Observable } from 'rxjs';
const API_URL = GlobalComponent.API_URL+'vehicule/';

@Injectable({ providedIn: 'root' })
export class VehiculeService {

    constructor(private http: HttpClient) { }
    /***
     * Get All User
     */
	 
	 
	
   
	
	getVehicules(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + 'liste');
  }
    getVehiculesparstatus(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + `status/${"1"}`);
  }

// Create a new client
createVehicule(vehiculeData: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  console.log(vehiculeData);
  
  return this.http.post<any>(API_URL + 'create', vehiculeData, { headers });
}

// Update an existing client
updateVehicule(id: number, vehiculeData: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  console.log(vehiculeData);
 
  return this.http.put<any>(API_URL + 'update/'+id, vehiculeData, { headers });
}



    /***
     * Facked User Register
     */
   
}
