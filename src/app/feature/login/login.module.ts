import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AdminLoginComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [AdminLoginComponent],
})
export class LoginModule {}
