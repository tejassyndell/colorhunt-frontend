import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: '500.component.html'
})
export class P500Component {

  constructor(private titleService: Title) {
    this.titleService.setTitle("Page Not Found | Colorhunt");
  }

}
