import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://127.0.0.1:8000/clients'; 

  constructor(private http: HttpClient) { }

  // Get all clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a specific client by ID
  getClient(id: number): Observable<any> {
    const url = `http://127.0.0.1:8000/client/${id}`;
    return this.http.get<any>(url);
  }

  // Create a new client
  createClient(clientData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = 'http://127.0.0.1:8000/client/create';
    return this.http.post<any>(url, clientData, { headers });
  }

  // Update an existing client
  updateClient(id: number, clientData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `http://127.0.0.1:8000/clientupdate/${id}`;
    return this.http.put<any>(url, clientData, { headers });
  }

  // Delete a client
  deleteClient(id: number): Observable<void> {
    const url = `http://127.0.0.1:8000/clientdelete/${id}`;
    return this.http.delete<void>(url);
  }
}
