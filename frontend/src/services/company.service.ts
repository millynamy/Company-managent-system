import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8080/company';  

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  getUsersByCompany(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${companyId}/users`);
  }

  getAnnouncementsByCompany(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${companyId}/announcements`);
  }

  getTeamsByCompany(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${companyId}/teams`);
  }

  addUserToCompany(companyId: number, user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${companyId}/users`, user);
  }

  
}
