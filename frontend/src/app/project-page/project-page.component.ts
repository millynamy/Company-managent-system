import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/services/project.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {
  teamId?: number;
  projects: any[] = [];
  isAdmin: boolean = false;

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  projectForm: FormGroup = new FormGroup({});
  currentProjectId?: number;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.teamId = +this.activatedRoute.snapshot.paramMap.get('teamId')!;
    const companyId = this.authenticationService.getCompanyId();
    this.isAdmin = this.authenticationService.isAdmin();

    if (companyId) {
      this.projectService
        .getProjectsByTeamWithCompanyId(companyId, this.teamId!)
        .subscribe((projects) => {
          this.projects = projects;
        });
    } else {
      console.error('Company ID is not available for the logged-in user.');
    }

    // Initialize the project form
    this.projectForm = this.formBuilder.group({
      name: [''],
      description: [''],
      active: [false],
    });
  }

  openEditModal(project?: any): void {
    this.isModalOpen = true;
    this.isEditMode = !!project;
    this.currentProjectId = project?.id;

    if (this.isEditMode) {
      this.projectForm.patchValue({
        name: project.name,
        description: project.description,
        active: project.active,
      });
    } else {
      this.projectForm.reset({
        name: '',
        description: '',
        active: false,
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.projectForm.reset();
  }

  onSubmit(): void {
    if (this.projectForm.invalid || !this.teamId) {
      console.error('Form is invalid or missing Team ID');
      return;
    }

    const projectData = this.projectForm.value;
    const companyId = this.authenticationService.getCompanyId();

    if (this.isEditMode && companyId && this.currentProjectId) {
      this.projectService
        .updateProject(companyId, this.teamId, this.currentProjectId, projectData)
        .subscribe((updatedProject) => {
          console.log('Project updated:', updatedProject);
          this.updateProjectList(updatedProject);
          this.closeModal();
        });
    } else if (companyId) {
      this.projectService
        .createProject(companyId, this.teamId, projectData)
        .subscribe((newProject) => {
          console.log('Project created:', newProject);
          this.projects.push(newProject);
          this.closeModal();
        });
    }
  }

  updateProjectList(updatedProject: any): void {
    const index = this.projects.findIndex(
      (project) => project.id === updatedProject.id
    );
    if (index > -1) {
      this.projects[index] = updatedProject;
    }
  }
}

