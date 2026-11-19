import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { DashboardApi, DashboardResponse } from './dashboard-api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  dashboardData: DashboardResponse | null = null;
  errorMessage = '';
  isLoading = true;

  // Get logged-in user's role
  role = sessionStorage.getItem('role');

  constructor(
    private dashboardApi: DashboardApi,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const request =
      this.role === 'AGENT'
        ? this.dashboardApi.getAgentDashboard()
        : this.role === 'CUSTOMER'
          ? this.dashboardApi.getCustomerDashboard()
          : null;

    if (!request) {
      this.errorMessage = 'User role not found. Please login again.';
      this.isLoading = false;
      return;
    }

    request
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
        },
        error: (error) => {
          console.error('Dashboard API error:', error);
          this.errorMessage = 'Unable to load dashboard.';
        },
      });
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
