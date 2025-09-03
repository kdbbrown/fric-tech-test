import { Injectable, signal } from '@angular/core';
import { inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from 'rxjs'; // Import Observable and tap
import {LoginRequest, LoginResponse, User} from "../../models/";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:3000';
  userSignal = signal<User | null>(null);

  constructor() {
    // Check if user data exists in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      this.userSignal.set(JSON.parse(userData));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userSignal.set(response.user);
        })
      );
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
