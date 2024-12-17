import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'detail-item/:bookID',
    loadChildren: () =>
      import('./pages/detail-item/detail-item.module').then(
        (m) => m.DetailItemPageModule
      ),
  },
  {
    path: 'reader/:bookID',
    loadChildren: () =>
      import('./pages/reader/reader.module').then((m) => m.ReaderPageModule),
  },
  {
    path: 'searchbar',
    loadChildren: () =>
      import('./pages/searchbar/searchbar.module').then(
        (m) => m.SearchbarPageModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./admin/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule
      ),
  },
  {
    path: 'books',
    loadChildren: () =>
      import('./admin/books/books.module').then((m) => m.BooksPageModule),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./admin/categories/categories.module').then(
        (m) => m.CategoriesPageModule
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./admin/users/users.module').then((m) => m.UsersPageModule),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./admin/orders/orders.module').then((m) => m.OrdersPageModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./admin/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
