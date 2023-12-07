import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-dashboard',
	templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loginerror: string;
	logincheck: boolean = false;
	blankdash: boolean = false;
	constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private spinner: NgxSpinnerService,private titleService: Title) {
		this.titleService.setTitle("Login | Colorhunt");
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required, ValidationService.passwordValidator]]
		});
	}

	ngOnInit() {

		if (localStorage.getItem('userData')) {
			// logged in so return true   
			this.router.navigate(['/dashboard'], {});
		} else {

			this.router.navigate(['/'], {});
		}

	}

	// Initicate login
	doLogin() {		
		this.spinner.show();
		this.userService.doLogin(this.loginForm.value).subscribe((res) => {
			if(res == 'NOTFOUND'){
				this.toastr.error('Email Not Found', 'This email address is not available');
			}
			else{
				if(res == 'DEACTIVE'){
					this.toastr.error('Deactivated', 'Your account has been deactivated by Admin');
				}
				else{
					if ( res != "") {
						this.spinner.hide();
						localStorage.setItem('logindata', JSON.stringify(res));
						localStorage.setItem('userdata', JSON.stringify(res));
						this.RoleCheck(res);
					}else{
						this.success(res);
					}
				}
			}
			this.spinner.hide();
		});
	}

	RoleCheck(result) {
		let item = JSON.parse(localStorage.getItem('userdata'));
		this.userService.getroleRights(item[0].Role).subscribe((res) => {			
			var Count = Object.keys(res).length;
			for (let i = 0; i < Count; i++) {
				if (res[i].PageId == 19) {
					this.blankdash = true
					break;
				}
			}
			this.success(result);
		});
	}

	// Login success function
	success(data) {

		if (data.length>0) {
			this.logincheck = false;
			localStorage.setItem('userData', JSON.stringify(data.data));
			if (this.blankdash == true) {
				this.router.navigate(['dashboard']);
			} else {
				this.router.navigate(['newdashboard']);
				
			}
			this.toastr.success('Success', 'Logged In Successfully');
		} else {
			this.logincheck = true;
			this.loginerror = "Invalid Credentials";
			//this.toastr.error('Failed', 'Invalid Credentials');
		}
	}

}
