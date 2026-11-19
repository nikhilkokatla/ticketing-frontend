import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Subscription, timer, switchMap, catchError, of } from 'rxjs';

interface Ticket {
  id: number;
  subject: string;
  description: string;
  priority: string;
  status: string;
}

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css',
})
export class MyTickets implements OnInit, OnDestroy {
  tickets: Ticket[] = [];

  selectedTicket: Ticket | null = null;

  isLoading = true;
  isUpdating = false;
  isDeleting = false;

  errorMessage = '';
  successMessage = '';

  private apiUrl = '/api/tickets';

  private refreshSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.startAutoRefresh();
  }

  // Get JWT authentication headers
  getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Automatically fetch tickets every 5 seconds
  startAutoRefresh(): void {
    this.refreshSubscription = timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.http
            .get<Ticket[]>(`${this.apiUrl}/my-tickets`, {
              headers: this.getHeaders(),
            })
            .pipe(
              catchError((error) => {
                console.error('My Tickets Error:', error);
                return of(null);
              }),
            ),
        ),
      )
      .subscribe((data) => {
        if (data !== null) {
          this.tickets = data;
          this.errorMessage = '';
        } else if (this.tickets.length === 0) {
          this.errorMessage = 'Unable to load tickets.';
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  // Open edit form
  editTicket(ticket: Ticket): void {
    console.log("button clicked",ticket)
    this.selectedTicket = { ...ticket };

    this.errorMessage = '';
    this.successMessage = '';
  }

  // Update customer's own ticket
  updateTicket(): void {
    if (!this.selectedTicket || this.isUpdating) {
      return;
    }

    const ticketId = this.selectedTicket.id;

    const updatedData = {
      subject: this.selectedTicket.subject,
      description: this.selectedTicket.description,
      priority: this.selectedTicket.priority,
    };

    if (!updatedData.subject.trim() || !updatedData.description.trim() || !updatedData.priority) {
      this.errorMessage = 'Please fill in all ticket details.';
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http
      .put<Ticket>(`${this.apiUrl}/my-tickets/${ticketId}`, updatedData, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (updatedTicket) => {
          this.tickets = this.tickets.map((ticket) =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket,
          );

          this.selectedTicket = null;
          this.successMessage = 'Ticket updated successfully.';

          this.isUpdating = false;
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Update Ticket Error:', error);

          this.errorMessage = error.error?.message || `Update failed. HTTP ${error.status}`;

          this.isUpdating = false;
          this.cdr.detectChanges();
        },
      });
  }

  // Delete customer's own ticket
  deleteTicket(ticket: Ticket): void {
    if (this.isDeleting) {
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ticket #${ticket.id}?`);

    if (!confirmDelete) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http
      .delete(`${this.apiUrl}/my-tickets/${ticket.id}`, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: () => {
          this.tickets = this.tickets.filter((item) => item.id !== ticket.id);

          this.successMessage = 'Ticket deleted successfully.';

          this.isDeleting = false;
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Delete Ticket Error:', error);

          this.errorMessage = error.error?.message || `Delete failed. HTTP ${error.status}`;

          this.isDeleting = false;
          this.cdr.detectChanges();
        },
      });
  }

  // Stop automatic refresh when leaving the page
  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }
}
