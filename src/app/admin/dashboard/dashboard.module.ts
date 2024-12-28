import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { LayoutModule } from '../components/module/layout.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    IonicModule,
    DashboardPageRoutingModule,
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
