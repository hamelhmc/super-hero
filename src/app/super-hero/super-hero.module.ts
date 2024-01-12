import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ShareModule } from '../share/share.module';
import { DeleteConfirmationDialogComponent } from './components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SuperHeroDetailComponent } from './components/super-hero-detail/super-hero-detail.component';
import { SuperHeroFormComponent } from './components/super-hero-form/super-hero-form.component';
import { SuperHeroListComponent } from './components/super-hero-list/super-hero-list.component';
import { SuperHeroService } from './services/super-hero.service';
import { SuperHeroRoutingModule } from './super-hero-routing.module';
import { UppercaseDirective } from './directive/uppercase.directive';

@NgModule({
  declarations: [
    SuperHeroListComponent,
    SuperHeroFormComponent,
    DeleteConfirmationDialogComponent,
    SuperHeroDetailComponent,
    UppercaseDirective,
  ],
  imports: [CommonModule, SuperHeroRoutingModule, ShareModule, HttpClientModule],
  providers: [SuperHeroService],
})
export class SuperHeroModule {}
