import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  createProject(companyId: number, teamId: number, newProject: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/company/${companyId}/teams/${teamId}/projects`, newProject);
  }
  

  updateProject(companyId: number, teamId: number, projectId: number, updatedProject: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/company/${companyId}/teams/${teamId}/projects/${projectId}`, updatedProject);
  }

  getProjectsByTeamWithCompanyId(companyId: number, teamId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/company/${companyId}/teams/${teamId}/projects`);
  }

  getProjectById(companyId: number, teamId: number, projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/company/${companyId}/teams/${teamId}/projects/${projectId}`);
  }

  getCompanyIdByTeamId(teamId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/teams/${teamId}/companyId`);
  }
  
  
}
