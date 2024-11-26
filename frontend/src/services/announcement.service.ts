import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:8080'; 

  constructor(private http: HttpClient) {}

  createAnnouncement(
    companyId: number,
    announcement: { title: string; message: string; authorId: number }
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/announcements/company/${companyId}`, announcement);
  }

  getAnnouncementsByCompany(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/company/${companyId}/announcements`);
  }
}

