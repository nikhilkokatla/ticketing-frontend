import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { RouterLink, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formData = this.loginForm.getRawValue();

    this.isSubmitting = true;

    this.authService
      .login({
        email: formData.email,
        password: formData.password,
      })
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          sessionStorage.setItem('token', response.token);

          sessionStorage.setItem('tokenType', response.tokenType);

          sessionStorage.setItem('role', response.role);

          this.router.navigate(['/dashboard']);
        },

        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Invalid email or password.';

          this.cdr.detectChanges();
        },
      });
  }
}
