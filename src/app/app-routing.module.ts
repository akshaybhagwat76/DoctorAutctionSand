import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AuthGuardService as AuthGuard,
  NonAuthGuardService as NonAuthGuard,
} from './guards/route-auth.guard';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'confirm-email',
    loadChildren: () =>
      import('./confirm-email/confirm-email.module').then((m) => m.ConfirmEmailModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'user/auction/bid-result/:auctionId/:token',
    loadChildren: () =>
    import('./user/user.module').then((m) => m.UserModule),
    canActivate:[NonAuthGuard]
  },
  {
    path: 'user',
    loadChildren: () =>
    import('./user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [NonAuthGuard],
  },

  { path: '', redirectTo: 'register', pathMatch: 'full' },

  // TODO: Create a custom 404 page
  // { path: '404', component: NotFound },

  // TODO: Once not found page is created redirect user to not found component
  // { path: '**', redirectTo: '404' },
  { path: '**', redirectTo: 'register' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
