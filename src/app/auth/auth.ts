import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  tokenType: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }
}
