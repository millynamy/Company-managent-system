import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { AnnouncementService } from 'src/services/announcement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  username: string = '';
  announcements: {
    id: number;
    date: string;
    message: string;
    author: {
      profile: {
        firstName: string;
        lastName: string;
      };
    };
  }[] = [];
  
  
  errorMessage: string = '';
  isModalOpen: boolean = false; 
  newAnnouncement = { title: '', message: '' }; 
  companyId: number | null = null;
  userId: number | null = null; 
  isAdmin: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private announcementService: AnnouncementService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.announcements);

    if (!this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.username = this.authenticationService.getUsername();
    this.companyId = this.authenticationService.getCompanyId();
    this.userId = this.authenticationService.getUserId();
    this.isAdmin = this.authenticationService.isAdmin();
  
    if (this.companyId) {
      this.announcementService.getAnnouncementsByCompany(this.companyId).subscribe({
        next: (data: any[]) => {
          console.log('Fetched Announcements:', data);
          this.announcements = data;
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to fetch announcements.';
          console.error('Error fetching announcements:', error);
        },
      });
    } else {
      this.errorMessage = 'No company ID found for the user.';
      this.router.navigate(['/login']);
    }
  }
  


  openNewAnnouncementModal() {
    this.isModalOpen = true;
  }

  closeNewAnnouncementModal() {
    this.isModalOpen = false;
  }

  submitNewAnnouncement(): void {
    if (!this.companyId || !this.userId) {
      console.error('Missing companyId or userId');
      this.errorMessage = 'Unable to create announcement. User or company information is missing.';
      return;
    }
  
    if (!this.newAnnouncement.title || !this.newAnnouncement.message) {
      console.error('Title or message cannot be empty');
      this.errorMessage = 'Title and message are required.';
      return;
    }
  
    const newAnnouncementPayload = {
      title: this.newAnnouncement.title,
      message: this.newAnnouncement.message,
      authorId: this.userId, 
    };
  
    this.isModalOpen = false;
  
    this.announcementService.createAnnouncement(this.companyId, newAnnouncementPayload).subscribe({
      next: (response) => {
        console.log('Announcement created:', response);
        this.announcements.push(response);
        this.resetNewAnnouncementForm(); 
      },
      error: (error) => {
        console.error('Failed to create announcement:', error);
        this.errorMessage = 'Failed to create announcement. Please try again.';
        this.isModalOpen = true; 
      },
    });
  }
  
  resetNewAnnouncementForm(): void {
    this.newAnnouncement = { title: '', message: '' };
  }
  


}

