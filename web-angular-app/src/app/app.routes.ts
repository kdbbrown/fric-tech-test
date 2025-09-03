import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import {AuthGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  // 1. Set default path to redirect to 'signin'
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signin'
  },

  // 2. Auth Routes (Public)
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Sign In | FricPay'
  },
  {
    path: 'signup', // You might not need this for the test, but it's here.
    component: SignUpComponent,
    title: 'Sign Up | FricPay'
  },

  // 3. App Routes (Protected by AuthGuard)
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard], // Protect all child routes
    children: [
      {
        path: 'dashboard',
        component: EcommerceComponent,
        title: 'Dashboard | FricPay'
      },
      {
        path: 'transactions',
        component: BasicTablesComponent,
        title: 'Transactions | FricPay'
      },
      {
        path: 'transfer',
        component: FormElementsComponent,
        title: 'New Transfer | FricPay'
      },

      {
        path: 'profile',
        component: ProfileComponent, // User profile/settings
        title: 'Profile | FricPay'
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },

  // 4. Catch-all route for 404 errors
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Page Not Found | FricPay'
  }
];
