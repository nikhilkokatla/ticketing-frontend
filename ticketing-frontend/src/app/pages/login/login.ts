import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../../shared/auth-shared.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  readonly loggedIn = signal(this.authService.isLoggedIn());

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  onSubmit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.successMessage.set(response.message || 'Login successful.');
        this.loggedIn.set(true);
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.getErrorMessage(err));
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.loggedIn.set(false);
    this.errorMessage.set('');
    this.successMessage.set('You have been logged out.');
  }

  private getErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Cannot reach the server. Check that the backend is running on port 8080.';
    }
    if (err.error && typeof err.error.message === 'string' && err.error.message) {
      return err.error.message;
    }
    if (err.status === 401 || err.status === 403) {
      return 'Invalid email or password.';
    }
    return 'Login failed. Please try again.';
  }
}
