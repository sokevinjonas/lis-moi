import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global/global.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  name: string = '';
  constructor(protected globalService: GlobalService) {}

  ngOnInit() {
    this.globalService.loadCategories();
  }
  storeCategorie() {
    console.log(this.name);
    alert(this.name);
  }
}
