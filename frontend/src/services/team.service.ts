import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/teams.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = 'http://localhost:8080/company';
  private teamApiUrl = 'http://localhost:8080/team';

  constructor(private http: HttpClient) {}

  createTeam(companyId: number, teamRequest: { name: string; description: string; teammates: any[] }): Observable<any> {
    return this.http.post<any>(`${this.teamApiUrl}/${companyId}/teams`, teamRequest); 
  }

  getProjectsByTeam(companyId: number, teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${companyId}/teams/${teamId}/projects`);
  }
  getTeamById(companyId: number, teamId: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${companyId}/teams/${teamId}`);
  }
  removeUserFromTeam(companyId: number, teamId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${companyId}/teams/${teamId}/users/${userId}`);
  }

  getUsersByCompany(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${companyId}/users`);
  }
  

  getUsersByTeam(companyId: number, teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${companyId}/teams/${teamId}/users`);
  }
}
