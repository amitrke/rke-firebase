import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyphotosComponent } from './myphotos/myphotos.component';
import { MypostsComponent } from './myposts/myposts.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'myposts', component: MypostsComponent },
  { path: 'myphotos', component: MyphotosComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
