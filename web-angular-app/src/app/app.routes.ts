import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';
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
      // 3.1. Dashboard (Main Accounts Overview)
      {
        path: 'dashboard',
        component: EcommerceComponent, // Reuse the main dashboard component
        title: 'Dashboard | FricPay'
      },

      // 3.2. Banking Features
      {
        path: 'accounts',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          {
            path: 'list',
            component: BasicTablesComponent, // Perfect for transactions list!
            title: 'Transactions | FricPay'
          },
          // You could add an 'account-details' route later
        ]
      },

      {
        path: 'transfer',
        component: FormElementsComponent, // Perfect for the transfer form!
        title: 'New Transfer | FricPay'
      },

      // 3.3. Other Pages (You can repurpose these)
      {
        path: 'analytics',
        component: LineChartComponent, // Use charts for spending analytics
        title: 'Analytics | FricPay'
      },
      {
        path: 'profile',
        component: ProfileComponent, // User profile/settings
        title: 'Profile | FricPay'
      },
      {
        path: 'calendar',
        component: CalenderComponent, // Could be used for scheduled payments
        title: 'Calendar | FricPay'
      },

      // 3.4. Default route for the 'app' section -> redirect to dashboard
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
