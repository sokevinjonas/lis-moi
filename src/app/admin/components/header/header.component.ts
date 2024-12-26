import { Component, inject, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    return;
  }

  toggleSidebar() {
    document.body.classList.toggle('toggle-sidebar');
  }

}
