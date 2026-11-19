import { Component } from '@angular/core';

import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private authService: Auth) {}

  registerForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),

    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.getRawValue();

    if (formData.password !== formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    this.isSubmitting = true;

    this.authService
      .register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe({
        next: (response: string) => {
          this.successMessage = response;
          this.registerForm.reset();
        },

        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        },
      });
  }
}
