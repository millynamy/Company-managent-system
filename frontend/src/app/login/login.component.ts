import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loginStatus$!: Observable<boolean>;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = '';
    this.password = '';
  }

  onLogin(): void {
    this.errorMessage = '';
    this.loginStatus$ = this.authenticationService.login(this.username, this.password);
    this.loginStatus$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.username = '';
        this.password = '';

        if (this.authenticationService.isAdmin()) {
          this.router.navigate(['/company']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.errorMessage = 'Invalid credentials or inactive user';
      }
    });
  }
}
