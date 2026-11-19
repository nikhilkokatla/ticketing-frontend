import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

interface Ticket {
  id: number;
  subject: string;
  description: string;
  priority: string;
  status: string;
  userId: number;
  userName: string;
  assignedToId: number | null;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-all-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-tickets.html',
  styleUrl: './all-tickets.css',
})
export class AllTickets implements OnInit {
  tickets: Ticket[] = [];

  isLoading = true;
  errorMessage = '';
  successMessage = '';

  private apiUrl = '/api/tickets';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  // Get authentication headers
  getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Sort tickets by ID in ascending order
  sortTickets(): void {
    this.tickets = [...this.tickets].sort((a, b) => a.id - b.id);
  }

  // Get all tickets
  loadTickets(): void {
    this.isLoading = true;

    this.http
      .get<Ticket[]>(this.apiUrl, {
        headers: this.getHeaders(),
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          this.tickets = data;
          this.sortTickets();
          this.errorMessage = '';
        },

        error: (error) => {
          console.error('Load tickets error:', error);
          this.errorMessage = 'Unable to load tickets.';
        },
      });
  }

  // Update ticket status
  updateStatus(ticket: Ticket): void {
    const request = {
      status: ticket.status,
    };

    this.successMessage = '';
    this.errorMessage = '';

    this.http
      .put<Ticket>(`${this.apiUrl}/${ticket.id}/status`, request, { headers: this.getHeaders() })
      .subscribe({
        next: (updatedTicket) => {
          this.tickets = this.tickets.map((item) =>
            item.id === updatedTicket.id ? updatedTicket : item,
          );

          this.sortTickets();

          this.successMessage = 'Ticket status updated successfully!';

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Update status error:', error);

          this.errorMessage = 'Unable to update ticket status.';

          this.loadTickets();
        },
      });
  }

  // Update ticket priority
  updatePriority(ticket: Ticket): void {
    const request = {
      priority: ticket.priority,
    };

    this.successMessage = '';
    this.errorMessage = '';

    this.http
      .put<Ticket>(`${this.apiUrl}/${ticket.id}/priority`, request, { headers: this.getHeaders() })
      .subscribe({
        next: (updatedTicket) => {
          this.tickets = this.tickets.map((item) =>
            item.id === updatedTicket.id ? updatedTicket : item,
          );

          this.sortTickets();

          this.successMessage = 'Ticket priority updated successfully!';

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Update priority error:', error);

          this.errorMessage = 'Unable to update ticket priority.';

          this.loadTickets();
        },
      });
  }
}
