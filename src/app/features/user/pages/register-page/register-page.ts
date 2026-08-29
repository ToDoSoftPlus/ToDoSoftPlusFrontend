import { Component, inject, signal } from '@angular/core';
import { RegisterRequest } from '../../models/register.model';
import { email, form, FormField, minLength, pattern, required, submit } from '@angular/forms/signals';
import { AuthSevice } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [FormField],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  router = inject(Router);
  authService = inject(AuthSevice);

  registerModel = signal<RegisterRequest>({
    email: '',
    password: '',
    userName: ''
  });

  registerForm = form(this.registerModel, (fieldPath) => {
    required(fieldPath.email, { message: "Email is required" });
    email(fieldPath.email, { message: "Enter a valid email address" });

    required(fieldPath.userName, { message: "Username is required" });
    minLength(fieldPath.userName, 3, { message: "Username must be at least 3 characters" })

    required(fieldPath.password, { message: "Password is required" });
    minLength(fieldPath.password, 6, { message: "Password must be at least 6 characters" })
    pattern(fieldPath.password, /^.*\d.*$/, { message: "Password must be have at least 1 digit" })
  });


  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.registerForm, async () => {
      const registerRequest = this.registerModel();
      this.authService.register(registerRequest).subscribe({
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
