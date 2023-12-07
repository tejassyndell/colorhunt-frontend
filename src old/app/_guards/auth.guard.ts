import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from "@angular/common";

@Injectable()
export class AuthGuard implements CanActivate {
    public Istrue: boolean = false;
    constructor(private router: Router, location: Location) { }
    checkLogin() {
        if (localStorage.getItem('logindata')) {
            // logged in so return true              
            return true;
        } else {
            this.router.navigate(['/'], {});
            return false;
        }
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('logindata')) {
            return true;
        }
        this.router.navigate(['/'], {});
        return false;
    }


}
