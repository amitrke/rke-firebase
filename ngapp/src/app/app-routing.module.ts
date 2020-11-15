import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyphotosComponent } from './myphotos/myphotos.component';
import { PosteditorComponent } from './posteditor/posteditor.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'newpost', component: PosteditorComponent },
  { path: 'myphotos', component: MyphotosComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
