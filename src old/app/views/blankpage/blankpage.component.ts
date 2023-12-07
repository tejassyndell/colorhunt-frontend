import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blankpage',
  templateUrl: './blankpage.component.html',
  styleUrls: ['./blankpage.component.scss']
})
export class BlankpageComponent implements OnInit {
  getuserdata: any;
  RolesName: any;
  constructor(private titleService: Title) { 
    this.titleService.setTitle("Dashboard | Colorhunt");
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
  }

  ngOnInit() {
    this.RolesName = this.getuserdata[0].RoleName;
  }

}
