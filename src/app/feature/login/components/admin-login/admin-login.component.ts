import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from 'src/app/data_access/authentication/roles';
import { JwtProviderService } from 'src/app/data_access/authentication/service/jwt-provider.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  constructor(
    private readonly jwtProvider: JwtProviderService,
    private formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('expires_at');
    sessionStorage.removeItem('username');
    console.log('[AdminLogin] Setting up form');
  }
  public authFailure: boolean = false;
  public loginForm = this.formBuilder.group({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit(): void {}

  public authenticate() {
    console.log('[AdminLogin] Attempting to login');
    this.jwtProvider.auth(this.loginForm.value);
    this.jwtProvider.authProcess.subscribe((event) => {
      if (event) {
        if (this.jwtProvider.role != Role.Admin) {
          this.authFailure = true;
          console.log('[AdminLogin] Admin login failed');
        } else {
          console.log(
            '[AdminLogin] Login successful, redirecting to admin dashboard'
          );
          this.router.navigate(['/admin']);
        }
      } else {
        this.authFailure = true;
        console.log('[AdminLogin] Admin login failed');
      }
    });
    //let username = document.getElementById('username')?.ariaValueMax;
  }
}
