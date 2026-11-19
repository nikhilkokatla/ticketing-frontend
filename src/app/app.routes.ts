import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './dashboard/dashboard';
import { CreateTicket } from './tickets/create-ticket/create-ticket';
import { MyTickets } from './tickets/my-tickets/my-tickets';
import { AllTickets } from './tickets/all-tickets/all-tickets';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  {
    path: 'register',
    component: Register,
  },

  {
    path: 'dashboard',
    component: Dashboard,
  },

  {
    path: 'create-ticket',
    component: CreateTicket,
  },

  {
    path: 'my-tickets',
    component: MyTickets,
  },

  {
    path: 'all-tickets',
    component: AllTickets,
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
