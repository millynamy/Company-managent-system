import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/services/project.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Project } from 'src/app/models/project.model';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
})
export class ProjectEditComponent implements OnInit {
  projectForm: FormGroup = new FormGroup({});
  projectId!: number;
  teamId!: number;
  companyId!: number;
  isEditMode: boolean = false;
  isAdmin: boolean = false; // Flag to check if the user is admin

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authenticationService.isAdmin();  // Check if the user is admin

    if (!this.isAdmin) {
      console.error('Unauthorized access. Admins only.');
      this.router.navigate(['/']); // Redirect non-admin users
      return;
    }

    this.activatedRoute.params.subscribe((params) => {
      console.log('Route Parameters:', params);

      this.companyId = +params['companyId'];
      this.teamId = +params['teamId'];
      this.projectId = +params['projectId'];

      if (isNaN(this.companyId) || isNaN(this.teamId)) {
        console.error('Invalid companyId or teamId detected in route params.');
        return;
      }

      this.isEditMode = !isNaN(this.projectId);

      this.projectForm = this.formBuilder.group({
        name: [''],
        description: [''],
        active: [false],
      });

      if (this.isEditMode) {
        this.loadProject();
      }
    });
  }

  loadProject(): void {
    this.projectService
      .getProjectById(this.companyId, this.teamId, this.projectId)
      .subscribe(
        (project: Project) => {
          this.projectForm.patchValue({
            name: project.name,
            description: project.description,
            active: project.active,
          });
        },
        (error) => {
          console.error('Error loading project:', error);
        }
      );
  }

  onSubmit(): void {
    if (this.projectForm.invalid || isNaN(this.teamId) || isNaN(this.companyId)) {
      console.error('Invalid teamId or companyId:', this.teamId, this.companyId);
      return;
    }

    const projectData = this.projectForm.value;

    if (this.isEditMode) {
      this.projectService.updateProject(this.companyId, this.teamId, this.projectId, projectData).subscribe(
        (updatedProject) => {
          console.log('Project updated:', updatedProject);
          this.router.navigate([`/teams/${this.teamId}/projects`]);
        },
        (error) => {
          console.error('Error updating project:', error);
        }
      );
    } else {
      this.projectService.createProject(this.companyId, this.teamId, projectData).subscribe(
        (newProject) => {
          console.log('Project created:', newProject);
          this.router.navigate([`/teams/${this.teamId}/projects`]);
        },
        (error) => {
          console.error('Error creating project:', error);
        }
      );
    }
  }  
}
