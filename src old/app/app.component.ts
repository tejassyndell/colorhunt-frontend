import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component
import { HttpClient } from '@angular/common/http'; 

@Component({
  // tslint:disable-next-line
  selector: 'body',
   template:'<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private bnIdle: BnNgIdleService) {
    this.bnIdle.startWatching(3600).subscribe((res) => {
      if (res) {
        this.router.navigate(['/'], {});
        //return false;
      }
    })
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
