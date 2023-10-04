import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle("Add Discount | Colorhunt");
  }

  ngOnInit() {
  }

}
