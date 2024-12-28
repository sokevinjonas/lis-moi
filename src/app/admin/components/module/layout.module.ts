import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiderbarComponent } from '../siderbar/siderbar.component';
import { HeaderComponent } from '../header/header.component';

@NgModule({
  declarations: [SiderbarComponent, HeaderComponent],
  imports: [CommonModule],
  exports: [SiderbarComponent, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule {}
