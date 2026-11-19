import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs';

import { Sidebar } from './shared/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  showSidebar = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateSidebarVisibility();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateSidebarVisibility();
    });
  }

  updateSidebarVisibility(): void {
    const currentUrl = this.router.url.split('?')[0];

    this.showSidebar = ['/dashboard', '/create-ticket', '/my-tickets', '/all-tickets'].includes(
      currentUrl,
    );
  }
}
