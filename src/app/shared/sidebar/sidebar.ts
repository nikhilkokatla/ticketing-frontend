import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  role: string = '';

  constructor() {
    this.role = sessionStorage.getItem('role') || '';
  }

  logout(): void {
    sessionStorage.clear();
    window.location.href = '/login';
  }
}
