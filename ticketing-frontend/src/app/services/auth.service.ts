import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'auth_token';

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  logout(): void {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch {
      // Storage not available; nothing to clear.
    }
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private saveToken(token: string): void {
    if (!token) {
      return;
    }
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {
      // Storage not available; the user will need to log in again next time.
    }
  }
}
