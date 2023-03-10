import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogViewComponent } from './pages/blog-view/blog-view.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'blog/:blogId', component: BlogViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
