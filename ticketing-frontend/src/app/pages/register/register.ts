import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../../shared/auth-shared.css',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch }
  );

  get name() {
    return this.form.controls.name;
  }
  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirmPassword() {
    return this.form.controls.confirmPassword;
  }

  onSubmit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.authService.register({ name, email, password }).subscribe({
      next: (response) => {
        this.successMessage.set(
          (response.message || 'Account created.') + ' Redirecting to sign in...'
        );
        this.form.reset();
        setTimeout(() => {
          this.isSubmitting.set(false);
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.getErrorMessage(err));
      },
    });
  }

  private getErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Cannot reach the server. Check that the backend is running on port 8080.';
    }
    if (err.error && typeof err.error.message === 'string' && err.error.message) {
      return err.error.message;
    }
    return 'Registration failed. Please try again.';
  }
}
