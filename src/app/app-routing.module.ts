import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoteComponent } from './notes/note/note.component';
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [
  // { path: '', component: HomePageComponent },
  {
    path: 'login',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    data: { title: 'Login' }
  },
  { 
    path: 'note/:id',
    component: NoteComponent,
    data: { title: 'Note' },
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'customers',
  //   loadChildren: () =>
  //     import('./customers/customers.module').then(m => m.CustomersModule),
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}