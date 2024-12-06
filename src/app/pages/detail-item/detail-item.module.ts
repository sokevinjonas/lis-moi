import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailItemPageRoutingModule } from './detail-item-routing.module';

import { DetailItemPage } from './detail-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailItemPageRoutingModule
  ],
  declarations: [DetailItemPage]
})
export class DetailItemPageModule {}
