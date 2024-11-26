import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}

