import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareModule } from '../share/share.module';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
  declarations: [BaseLayoutComponent],
  imports: [CommonModule, LayoutRoutingModule, ShareModule],
})
export class LayoutModule {}
