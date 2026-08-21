import { Component, inject, signal } from '@angular/core';
import { LoginRequest } from '../../models/login.model';
import { form, FormField, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthSevice } from '../../../../core/services/auth';

@Component({
  selector: 'app-login-page',
  imports: [FormField],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  router = inject(Router);
  authService = inject(AuthSevice);

  loginModel = signal<LoginRequest>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      const loginRequest = this.loginModel();
      this.authService.login(loginRequest).subscribe({
        next: () => {
          this.router.navigate(["/"]);
        },
        error: error => {
          console.log(error);
        }
      });
    });
  }
}
