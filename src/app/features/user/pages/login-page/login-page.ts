import { Component, inject, signal } from '@angular/core';
import { LoginRequest } from '../../models/login.model';
import { form, FormField, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthSevice } from '../../../../core/services/auth';
import { StatusNotification } from '../../../../shared/components/status-notification/status-notification';
import { StatusNotificationData } from '../../../../shared/models/status-notification.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../../../../core/models/common/error-response.mode';

@Component({
  selector: 'app-login-page',
  imports: [FormField, StatusNotification],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  statusNotification = signal<StatusNotificationData | null>(null);
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
          this.statusNotification.set({
            type: 'success',
            message: "Successfully login"
          });

          setTimeout(() => {
            this.router.navigate(["/"]);
          }, 2500);
        },
        error: (error: HttpErrorResponse) => {
          const response = error.error as ErrorResponse;
          this.statusNotification.set({
            type: 'error',
            message: response.Message,
            errors: response.Errors,
          });
        }
      });
    });
  }
}
