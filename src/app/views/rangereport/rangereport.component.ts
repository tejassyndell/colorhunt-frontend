import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-rangereport',
  templateUrl: './rangereport.component.html',
  styleUrls: ['./rangereport.component.scss']
})
export class RangereportComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle("Range Report | Colorhunt");
   }

  ngOnInit() {
  }

}
