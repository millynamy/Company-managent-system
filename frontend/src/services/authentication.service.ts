import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticated = false;
  private username: string = '';
  private companyId: number | null = null;
  private isAdminFlag: boolean = false;
  private userId: number | null = null; 

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    const credentials = { username, password };
  
    return this.http.post<any>(`${this.apiUrl}/users/login`, credentials).pipe(
      map((response) => {
        if (response && response.active) {
          this.isAuthenticated = true;
          this.username = response.profile.firstName + ' ' + response.profile.lastName;
          this.companyId = response.companies?.[0]?.id || null;
          this.userId = response.id; 
          this.isAdminFlag = response.admin;
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of(false);
      })
    );
  }
  

  logout(): void {
    this.isAuthenticated = false;
    this.username = '';
    this.companyId = null;
    this.isAdminFlag = false;
    this.userId = null; 
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  isAdmin(): boolean {
    return this.isAdminFlag;
  }

  getUsername(): string {
    return this.username;
  }

  getCompanyId(): number | null {
    return this.companyId;
  }

  getUserId(): number | null {
    return this.userId;
  }
}
