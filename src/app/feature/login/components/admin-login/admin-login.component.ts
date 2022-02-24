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
  ) {}
  public authFailure: boolean = false;
  public loginForm = this.formBuilder.group({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit(): void {}

  public authenticate() {
    this.jwtProvider.auth(this.loginForm.value);
    this.jwtProvider.authProcess.subscribe((event) => {
      if (event) {
        if (sessionStorage.getItem('role') != Role.Admin) {
          this.authFailure = true;
        } else {
          this.router.navigate(['/admin']);
        }
      } else {
        this.authFailure = true;
      }
    });
    //let username = document.getElementById('username')?.ariaValueMax;
  }
}
