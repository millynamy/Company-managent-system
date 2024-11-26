import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';

@Component({
    selector: 'app-user-registry',
    templateUrl: './user-registry.component.html',
    styleUrls: ['./user-registry.component.css'],
})
export class UserRegistryComponent implements OnInit {
    users: any[] = [];
    isModalOpen: boolean = false; 
    newUser = {
        profile: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
        password: '',
        confirmPassword: '',
        admin: false,
    };

    constructor(
        private authService: AuthenticationService,
        private userService: UserService
    ) {}

    ngOnInit() {
        if (this.authService.isAdmin()) {
            this.fetchUsers();
        }
    }

    fetchUsers() {
      const companyId = this.authService.getCompanyId();
      if (companyId) {
          this.userService.getUsersByCompany(companyId).subscribe(
              (data) => {
                  this.users = data;
                  console.log('Fetched users:', data);
              },
              (error) => {
                  console.error('Error fetching users:', error);
              }
          );
      } else {
          console.error('Company ID not available');
      }
  }
  

    openAddUserModal() {
        this.isModalOpen = true;
    }

    closeAddUserModal() {
        this.isModalOpen = false;
    }

    submitNewUser() {
        const companyId = this.authService.getCompanyId();
        if (companyId) {
            const userRequest = {
                profile: this.newUser.profile,
                credentials: {
                    username: this.newUser.profile.email,
                    password: this.newUser.password,
                },
                isAdmin: this.newUser.admin,
            };

            this.userService.createUser(companyId, userRequest).subscribe(
                (response) => {
                    console.log('User successfully added:', response);
                    this.users.push(response); 
                    this.closeAddUserModal();
                },
                (error) => {
                    console.error('Error adding user:', error);
                }
            );
        } else {
            console.error('Company ID is missing');
        }
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }
}


