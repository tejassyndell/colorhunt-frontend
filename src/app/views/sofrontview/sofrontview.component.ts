// import { environment } from './../../../environments/environment';
// import { Component, OnInit, NgModule } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { UserService } from '../../services/user.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { Location } from '@angular/common';
// import { Title } from '@angular/platform-browser';

// @NgModule({
//   imports: [NgxPaginationModule]
// })
// @Component({
//   selector: 'app-sofrontview',
//   templateUrl: './sofrontview.component.html',
//   styleUrls: ['./sofrontview.component.scss']
// })
// export class SofrontviewComponent implements OnInit {
//   public catarticallist: any = [];
//   public categorylist: any = [];
//   p1: number = 1;
//   maintitle: any;
//   uploadURL: string = environment.getuploadURL;
//   myModel: any;
//   page: number = 1;
//   nodata: boolean = false;
//   searchnodata: boolean = false;
//   radioSelected: string;
//   totalcartitem: any;
//   typestr: any;
//   accessdenied: boolean = true;
//   isList: any;
//   isAdd: any;
//   isEdit: any;
//   isDelete: any;
//   catid: any;
//   constructor(private location: Location, public router: Router, private route: ActivatedRoute, private userService: UserService, private spinner: NgxSpinnerService,private titleService: Title) {
//     this.titleService.setTitle("SO Front View | Colorhunt");
//     this.totalcartitem = 0;
//     if (localStorage.getItem('CartIteam') !== null) {
//       this.totalcartitem = JSON.parse(localStorage.getItem('CartIteam')).length;
//     }

//   }

//   ngOnInit() {

//     document.body.className = 'app sidebar-hidden sidebar-fixed aside-menu-fixed aside-menu-hidden';
   

//     document.getElementsByClassName("main")[0].classList.add("mainbg");
//     let item = JSON.parse(localStorage.getItem('userdata'));
//     let rolerights = JSON.parse(localStorage.getItem('roleright'));
   
//     if (rolerights != "" && rolerights != null && rolerights !== undefined) {
//       this.rightscheck(rolerights, 1);
//     } else {
//       this.userService.getroleRights(item[0].Role).subscribe((res) => {
//         this.rightscheck(res, 2);
//       });
//     }

//     let data = this.route.snapshot.paramMap.get('id');
//     this.radioSelected = data;
//     this.userService.getcategoryarticlelist(data).subscribe((res) => {
//       debugger;
//       if (res != [] && res != "") {
//         this.maintitle = res[0].Title;
//         this.catarticallist = res;
//       } else {
//         this.catarticallist = [];
//         this.nodata = true;
//       }

//     });
//     this.userService.categorylist().subscribe((res) => {
   
//       this.categorylist = res;
//     });

//   }

//   gotoDetails(id) {
//     this.router.navigate(['sofrontdetails', { id: id }]);
//   }

//   gotomyorders() {
//     this.router.navigate(['myorders']);
//   }
//   category(id, text) {
//     this.spinner.show();
//     this.typestr = text;
//     this.myModel = "";
//     this.userService.getcategoryarticlelist(id).subscribe((res) => {
//      debugger;
//      this.catid = id;
//      this.location.replaceState('/sofrontview;id='+id);
//     //  const queryParams: Params = { id: id };

//     // this.router.navigate(
//     //   [], 
//     //   {
//     //     relativeTo: activatedRoute,
//     //     queryParams: queryParams, 
//     //     queryParamsHandling: 'merge', // remove to replace all query params by provided
//     //   });
//       this.spinner.hide();
//       if (res != [] && res != "") {
//         this.maintitle = res[0].Title;
//         this.catarticallist = res;
//         this.nodata = false;
//         document.getElementsByClassName("my-pagination")[0].classList.add("visible");
//         document.getElementsByClassName("my-pagination")[0].classList.remove("invisible");
//       } else {
//         document.getElementsByClassName("my-pagination")[0].classList.add("invisible");
//         document.getElementsByClassName("my-pagination")[0].classList.remove("visible");
//         this.maintitle = "";
//         this.catarticallist = [];
//         this.nodata = true;
//       }
//     });
//   }

//   getimagepath(image, type) {
//     if (image != null && image != "") {
//       const img1 = image.split(',')[type];
//       if (img1 != undefined) {
//         const url = this.uploadURL + image.split(',')[type];
//         return (url) ? url : 'assets/img/no-image-available.png';
//       } else {
//         return 'assets/img/no-image-available.png';
//       }
//     } else {
//       return 'assets/img/no-image-available.png';
//     }

//   }

//   getsearch() {
//     var str = this.myModel.length;
//     this.typestr = this.myModel;
//     if (str > 2) {
//       let body = {
//         "Name": this.myModel
//       }
//       this.spinner.show();
//       this.userService.searchitem(body).subscribe((res) => {
     
//         this.spinner.hide();
//         if (res != [] && res != "") {
//           this.maintitle = "Result";
//           this.searchnodata = false;
//           this.nodata = false;
//           this.catarticallist = res;
//           document.getElementsByClassName("my-pagination")[0].classList.add("visible");
//           document.getElementsByClassName("my-pagination")[0].classList.remove("invisible");
//         } else {
//           document.getElementsByClassName("my-pagination")[0].classList.add("invisible");
//           document.getElementsByClassName("my-pagination")[0].classList.remove("visible");
//           //my-pagination
//           this.catarticallist = res;
//           this.nodata = true;
//           this.searchnodata = true;
//         }

//       });
//     } else {
//       document.getElementsByClassName("my-pagination")[0].classList.remove("invisible");
//       this.spinner.hide();
//       let data = this.route.snapshot.paramMap.get('id');
//       if(this.route.snapshot.paramMap.get('id') != this.catid){
//         data = this.catid;
//       }
//       this.userService.getcategoryarticlelist(data).subscribe((res) => {
//         debugger;
//         if (res != [] && res != "") {
//           this.nodata = false;
//           this.searchnodata = false;
//           this.maintitle = res[0].Title;
//           this.catarticallist = res;
//         } else {
//           this.nodata = true;
//           this.searchnodata = true;
//         }

//       });

//     }

//   }

//   rightscheck(data, no) {
//     let item = JSON.parse(localStorage.getItem('userdata'));
//     if (no == 1) {
//       var Count = Object.keys(data).length;
//       for (let i = 0; i < Count; i++) {
//         if (data[i].PageId == 26) {
//           let parameterInnerId = this.route.snapshot.paramMap.get('id');
//           if (data[i].ListRights == 1) {
//             if (parameterInnerId != "" && parameterInnerId != undefined && parameterInnerId != null) {
//               this.accessdenied = false;
//             } else {
//               this.accessdenied = true;
//             }
//           } else {
//             this.accessdenied = true;
//           }
//           this.isList = data[i].ListRights;
//           this.isAdd = data[i].AddRights;
//           this.isEdit = data[i].EditRights;
//           this.isDelete = data[i].DeleteRights;
//           break;
//         } else {
//           this.accessdenied = true;
//         }

//       }
//     } else {
//       for (let i = 0; i < data.length; i++) {
//         if (data[i].PageId == 26) {
//           if (data[i].ListRights == 1) {
//             this.accessdenied = false;
//           } else {
//             this.accessdenied = true;
//           }
//           this.isList = data[i].ListRights;
//           this.isAdd = data[i].AddRights;
//           this.isEdit = data[i].EditRights;
//           this.isDelete = data[i].DeleteRights;
//           break;
//         } else {
//           this.accessdenied = true;
//         }

//       }

//     }
//   }

// }
