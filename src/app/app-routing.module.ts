import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './data_access/authentication/guard/auth.guard';
import { Role } from './data_access/authentication/roles';
import { AdminDashboardComponent } from './feature/admin/admin-dashboard/admin-dashboard.component';
import { AdminMapComponent } from './feature/admin/components/admin-map/admin-map.component';
import { MapComponent } from './feature/gps/components/map/map.component';
import { AdminLoginComponent } from './feature/login/components/admin-login/admin-login.component';
import { DefaultComponent } from './ui/role/components/default/default.component';

export const routes: Routes = [
  { path: '', component: DefaultComponent },
  { path: 'login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin],
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
