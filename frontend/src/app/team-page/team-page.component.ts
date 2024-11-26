import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/services/company.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { ProjectService } from 'src/services/project.service';
import { TeamService } from 'src/services/team.service';
import { Team } from '../models/teams.model';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.css'],
})
export class TeamPageComponent implements OnInit {
  companyId: number | null = null;
  teams: Team[] = [];
  isAdmin: boolean = false;

  isModalOpen: boolean = false;

  newTeam: {
    name: string;
    description: string;
    members: any[];
  } = {
      name: '',
      description: '',
      members: [],
    };

  selectedMember: any = null;
  availableUsers: any[] = [];

  constructor(
    private companyService: CompanyService,
    private authService: AuthenticationService,
    private teamService: TeamService,
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.companyId = this.authService.getCompanyId();
    this.isAdmin = this.authService.isAdmin();

    if (this.companyId === null) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadTeams();
    this.loadAvailableUsers();
  }

  loadTeams(): void {
    if (this.companyId) {
      this.companyService.getTeamsByCompany(this.companyId).subscribe(
        (teams: Team[]) => {
          this.teams = teams;
          this.getProjectsCountForTeams();
        },
        (error) => {
          console.error('Error loading teams', error);
        }
      );
    }
  }

  getProjectsCountForTeams(): void {
    for (let team of this.teams) {
      this.projectService
        .getProjectsByTeamWithCompanyId(this.companyId!, team.id)
        .subscribe(
          (projects) => {
            team.projectsCount = projects.length;
          },
          (error) => {
            console.error(`Error fetching projects for team ${team.name}`, error);
            team.projectsCount = 0;
          }
        );
    }
  }

  loadAvailableUsers(): void {
    if (this.companyId) {
      this.teamService.getUsersByCompany(this.companyId).subscribe(
        (users: any[]) => {
          this.availableUsers = users.filter(user => user.active);
        },
        (error) => {
          console.error('Error loading users:', error);
        }
      );
    }
  }



  openAddTeamModal(): void {
    this.isModalOpen = true;
  }

  closeAddTeamModal(): void {
    this.isModalOpen = false;
    this.resetNewTeamForm();
  }

  resetNewTeamForm(): void {
    this.newTeam = {
      name: '',
      description: '',
      members: [],
    };
    this.selectedMember = null;
  }

  addMember(): void {
    if (this.selectedMember && !this.newTeam.members.includes(this.selectedMember)) {
      console.log('Adding member:', this.selectedMember); 
      this.newTeam.members.push(this.selectedMember);
      this.availableUsers = this.availableUsers.filter(user => user !== this.selectedMember);
      console.log('Updated members:', this.newTeam.members);
      this.selectedMember = null;
    }
  }
  


  removeMember(member: any): void {
    this.newTeam.members = this.newTeam.members.filter(m => m !== member);

    this.availableUsers.push(member);
  }

  submitNewTeam(): void {
    if (!this.companyId) {
      console.error('Company ID is missing');
      return;
    }
  
    console.log('Submitting team:', this.newTeam);
  
    const teamRequest = {
      name: this.newTeam.name,
      description: this.newTeam.description,
      teammates: this.newTeam.members.map((member) => ({
        id: member.id,
        profile: member.profile,
        admin: member.admin,
        active: member.active,
        status: member.status,
      })),
    };
  
    this.teamService.createTeam(this.companyId, teamRequest).subscribe({
      next: (response) => {
        console.log('Team successfully created:', response);
        this.teams.push(response);
        this.closeAddTeamModal(); 
      },
      error: (error) => {
        console.error('Error creating team:', error);
      },
    });
  }
  
  onTeamClick(teamId: number): void {
    this.router.navigate([`/teams/${teamId}/projects`]);
  }
}

