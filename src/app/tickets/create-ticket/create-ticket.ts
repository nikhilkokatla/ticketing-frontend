import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  private apiUrl = '/api/tickets';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ticketForm = new FormGroup({
    subject: new FormControl('', [Validators.required]),

    description: new FormControl('', [Validators.required]),

    priority: new FormControl('MEDIUM', [Validators.required]),
  });

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post(this.apiUrl, this.ticketForm.value, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Ticket created successfully!';
        this.ticketForm.reset({
          subject: '',
          description: '',
          priority: 'MEDIUM',
        });
        this.isSubmitting = false;
      },

      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to create ticket.';
        this.isSubmitting = false;
      },
    });
  }
}
