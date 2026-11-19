import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardResponse {
  totalTickets: number;
  todoTickets: number;
  inProgressTickets: number;
  completedTickets: number;
  highPriorityTickets: number;
  mediumPriorityTickets: number;
  lowPriorityTickets: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardApi {
  private apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAgentDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/statistics`, {
      headers: this.getHeaders(),
    });
  }

  getCustomerDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/customer`, {
      headers: this.getHeaders(),
    });
  }
}
