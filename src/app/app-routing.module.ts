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
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
