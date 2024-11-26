import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/services/company.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.css']
})
export class CompanyPageComponent implements OnInit {
  selectedCompany: string = '';
  companies: string[] = [];

  constructor(
    private companyService: CompanyService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authenticationService.isLoggedIn() || !this.authenticationService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    this.companyService.getCompanies().subscribe({
      next: (data: string[]) => {
        this.companies = data;
      },
      error: (error) => {
        console.error('Error fetching companies', error);
      },
    });
  }

  onCompanyChange(event: any): void {
    this.selectedCompany = event.target.value;
  }

  onSubmit(): void {
    if (this.selectedCompany) {
      this.router.navigate(['/home'], { queryParams: { company: this.selectedCompany } });
    }
  }
}
