import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperHeroDetailComponent } from './components/super-hero-detail/super-hero-detail.component';
import { SuperHeroListComponent } from './components/super-hero-list/super-hero-list.component';

const routes: Routes = [
  {
    path: '',
    component: SuperHeroListComponent,
  },
  { path: ':id', component: SuperHeroDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperHeroRoutingModule {}
