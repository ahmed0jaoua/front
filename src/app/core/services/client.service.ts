import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';

const API_URL = GlobalComponent.API_URL;
@Injectable({
  providedIn: 'root'
})

export class ClientService {
  
 
  constructor(private http: HttpClient) { }

  // Get all clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(API_URL+'clients' );
  }

  // Get a specific client by ID
  getClient(id: number |null ): Observable<any> {
    const url = `${API_URL}client/${id}`;
    return this.http.get<any>(url);
  }
  
  // Create a new client
  createClient(clientData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${API_URL}client/create`;
    return this.http.post<any>(url, clientData, { headers });
  }

  
 // const url = `http://127.0.0.1:8000/clientupdate/${id}`;
  updateClient(id: number, clientData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(API_URL+`clientupdate/${id}`, clientData, { headers });
  }

  
  deleteClient(id: number): Observable<void> {
    const url = `${API_URL}clientdelete/${id}`;
    return this.http.delete<void>(url);
    
  }
}
