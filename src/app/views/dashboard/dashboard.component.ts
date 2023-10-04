import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  public Open_PO: any;
  public Open_SO: any;

  constructor() {
    this.Open_PO = 0;
    this.Open_SO = 0;
  }

  ngOnInit() {
    // Simulate API data retrieval
    setTimeout(() => {
      this.Open_PO = 10; // Replace with actual data
      this.Open_SO = 20; // Replace with actual data
    }, 1000);
  }
}
