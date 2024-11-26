import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from 'src/services/team.service';
import { AuthenticationService } from 'src/services/authentication.service';
@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {
  companyId: number | null = null;
  teamName: string = '';
  teamDescription: string = '';

  constructor(
    private teamService: TeamService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.companyId = this.authService.getCompanyId();

    if (this.companyId === null) {
      this.router.navigate(['/login']);
      return;
    }
  }

  onSubmit(): void {
    const teamRequest = {
      name: 'Team Name',
      description: 'Team Description',
      teammates: [], // Include teammates field even if empty
    };

    if (this.companyId) {
      this.teamService.createTeam(this.companyId, teamRequest).subscribe(
        () => {
          this.router.navigate(['/teams']);
        },
        (error) => {
          console.error('Error creating team', error);
        }
      );
    }
  }
}
