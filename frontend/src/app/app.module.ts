import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { AuthGuard } from 'src/services/authguard.service';
import { HomeComponent } from './home/home.component';
import { CompanyPageComponent } from './company-page/company-page.component';
import { LoginComponent } from './login/login.component';
import { TeamPageComponent } from './team-page/team-page.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { UserRegistryComponent } from './user-registry/user-registry.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: LoginComponent },  
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'teams', component: TeamPageComponent, canActivate: [AuthGuard] },
  { path: 'teams/:teamId/projects', component: ProjectPageComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserRegistryComponent, canActivate: [AuthGuard] },
  { path: 'company', component: CompanyPageComponent, canActivate: [AuthGuard] },
  { path: 'add-team', component: AddTeamComponent, canActivate: [AuthGuard] },
  { path: 'company/:companyId/teams/:teamId/projects/create', component: ProjectEditComponent, canActivate: [AuthGuard] },
  { path: 'company/:companyId/teams/:teamId/projects/:projectId/edit', component: ProjectEditComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CompanyPageComponent,
    LoginComponent,
    TeamPageComponent,
    ProjectPageComponent,
    UserRegistryComponent,
    NavbarComponent,
    AddTeamComponent,
    ProjectEditComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
