import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ValidationService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { Console } from 'console';
import * as XLSX from 'xlsx';
import { exit } from 'process';


@Component({
  selector: 'app-articleratechange',
  templateUrl: './articleratechange.component.html',
  styleUrls: ['./articleratechange.component.scss']
})
export class ArticleratechangeComponent implements OnInit {
  ArticleRateForm: FormGroup;
  
  
  public partypdown: any = [];
  partyid: number = 0;
  public remainingso: any = [];
  public articlelist: any = [];
  public editarray = {};
  DropdownSO: boolean = true;
  StatusDisabled: boolean = true;
  statuscheck: boolean = false;
  getuserdata: any;
  ArticleRate: any;
  articaldata: any;
  ArticleCat: any;
  ArticleInDate: any;
  public subcatedropdown: any = [];
  PrintArticleRate: any;

  
  //OutletArticleRate: any;
  accessdenied: boolean = true;
  isArtSelected: boolean = false;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  ArticleId:any;
  ArticleCatForm: any;
  ArticleInDateForm: any;
  articlesArray: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService ,private titleService: Title) {
    this.titleService.setTitle("Change Article Rate | Colorhunt");
    this.ArticleRateForm = this.formBuilder.group({
      // console.log('dddJaimin CAT', this.ArticleRateForm);
      ArticleId: ['', [Validators.required]],
      ArticleRate: ['', [Validators.required, Validators.min(1)]],
      ArticleCat: ['', [Validators.required, Validators.min(1)]],
      ArticleInDate: ['', [Validators.required, Validators.min(1)]],

    //  OutletArticleRate: ['', [Validators.required]]
    });
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
    if (this.accessdenied == false) {
    this.userService.articallist().subscribe((res) => {
      // console.log('just data', res)

      this.articlelist = res;
    });
  }
  let item1 = JSON.parse(localStorage.getItem('userdata'));

    if(item1[0].Role==2){
      this.partyid = 0;
    }else{
      this.partyid = item[0].PartyId;
    }
    this.userService.GeOutletPartyarticleratechange(this.partyid).subscribe((res) => {
      this.partypdown = res;
    });

  }


  rightscheck(data: string | Object, no: number) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 22) {
          if (data[i].EditRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = true;
          }
          this.isList = data[i].ListRights;
          this.isAdd = data[i].AddRights;
          this.isEdit = data[i].EditRights;
          this.isDelete = data[i].DeleteRights;
          break;
        } else {
          this.accessdenied = true;
        }

      }
    } else {
      // for (let i = 0; i < data.length; i++) {
      //   if (data[i].PageId == 22) {
      //     if (data[i].EditRights == 1) {
      //       this.accessdenied = false;
      //     } else {
      //       this.accessdenied = true;
      //     }
      //     this.isList = data[i].ListRights;
      //     this.isAdd = data[i].AddRights;
      //     this.isEdit = data[i].EditRights;
      //     this.isDelete = data[i].DeleteRights;
      //     break;
      //   } else {
      //     this.accessdenied = true;
      //   }

      // }

    }
  }


  onChangePartyId(event){

    this.userService.articallistoutlet(event.target.value).subscribe((res) => {
      // console.log('dataotl', res)
      this.articlelist = res;
        // if (Object.keys(res).length > 0) {
        // } else {
        //   this.formrestvalue();
        //   this.articlelist = null;
        // }

    });
    // console.log('Jaimin',event.target.value)

  }

  
  onChangeArticle(event: { Id: string; }) {
    
    this.isArtSelected = true
    if (event.Id != "") {
      this.spinner.show();      
      const newVal = event.Id;
      // console.log('newVal',newVal)
      this.PrintArticleRate = newVal;
      // console.log(event.Id)
      this.userService.getanarticaldata(newVal).subscribe((res) => {
        // console.log('Here',res)
        this.statuscheck = true;
        if (res["length"] > 0) {

          
          this.ArticleRate = res[0].ArticleRate;
          // console.log('dddJaimin RATE', res[0].ArticleRate)
          
          this.ArticleCat = res[0].Title;
          // console.log('dddJaimin CAT', this.ArticleCat)

          this.ArticleInDate = res[0].InwardDate;
          // console.log('dddJaimin DATE', this.ArticleInDate)
          
        } else {
          this.ArticleRate = "";
          this.ArticleCat = "";
          this.ArticleInDate = "";
        //  this.OutletArticleRate = "";
        }

        this.spinner.hide();
      });
    }
      
    // this.userService.getarticaldata(this.PrintArticleRate).subscribe((res) => {
    //   //console.log(res);
    //   console.log('DataHere',res)
    //   this.articaldata = res;
    //   // console.log(this.articaldata)
    //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.articaldata);
    //   var wscols = [
    //     { width: 22.63 },
    //     { width: 11.75 }, // second column
    //     { width: 20.38 }, //...
    //     { width: 12.63 }
    //   ];
    //   ws["!cols"] = wscols;
    //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //   /* save to file */  
    //   XLSX.writeFile(wb, "Articalratechange.xlsx");
    // });


  }  

  onExportArticle(event: { Id: string; }){

    // console.log('*********', event.Id)
    // if (event.Id != "") {
    //   this.spinner.show();

    //   const newVal = event.Id;
    //   this.userService.getarticaldata(newVal).subscribe((res) => {
    //     // console.log(res);
    //     this.statuscheck = true;
    //     if (res["length"] > 0) {

          
    //       this.ArticleRate = res[0].ArticleRate;
    //       // console.log('dddJaimin RATE', res[0].ArticleRate)
          
    //       this.ArticleCat = res[0].Title;
    //       // console.log('dddJaimin CAT', this.ArticleCat)

    //       this.ArticleInDate = res[0].InwardDate;
    //       // console.log('dddJaimin DATE', this.ArticleInDate)
          
    //     } else {
    //       this.ArticleRate = "";
    //       this.ArticleCat = "";
    //       this.ArticleInDate = "";
    //     //  this.OutletArticleRate = "";
    //     }

    //     this.spinner.hide();
    //   });
    // }


    // console.log("Jaimin")
    this.userService.getarticaldata(this.PrintArticleRate).subscribe((res) => {
      // console.log('Data',res)
      // console.log(res);
      this.articaldata = res;
      // console.log(this.articaldata);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.articaldata);
      var wscols = [
        { width: 22.63 },
        { width: 11.75 }, // second column
        { width: 20.38 }, //...
        { width: 12.63 }
      ];
      ws["!cols"] = wscols;
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */  
      XLSX.writeFile(wb, "Articalratechange.xlsx");
    });
  }

  
  // onExportArticle(event: { Id: string; }) {

  //   if (event.Id != "") {  
  //     this.spinner.show();

  //     const newVal2 = event.Id;
  //     this.userService.getarticaldata(newVal2).subscribe((res) => {
  //       // console.log(res);
  //       this.statuscheck = true;
  //       if (res["length"] > 0) {

          
  //         this.ArticleRate = res[0].ArticleRate;
  //         this.ArticleCat = res[0].Title;
  //         this.ArticleInDate = res[0].InwardDate;
  //       } else {
  //         this.ArticleRate = "";
  //         this.ArticleCat = "";
  //         this.ArticleInDate = "";
  //       }

  //       this.spinner.hide();
  //     });
  //   }
  //   this.userService.getarticaldata(newVal2).subscribe((res) => {
  //     //console.log(res);
  //     // console.log(res);
  //     this.articaldata = res;
  //     console.log(res)
  //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.articaldata);
  //     var wscols = [
  //       { width: 22.63 },
  //       { width: 11.75 }, // second column
  //       { width: 20.38 }, //...
  //       { width: 12.63 }
  //     ];
  //     ws["!cols"] = wscols;
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //     /* save to file */  
  //     XLSX.writeFile(wb, "Articalratechange.xlsx");
  //   });
    
  // }



  // articalRatechange() {
  //   this.userService.getarticalratedata().subscribe((res) => {
  //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res);
  //     const wscols = [
  //       { width: 22.63 },
  //       { width: 11.75 },
  //       { width: 20.38 },
  //       { width: 12.63 },
  //     ];
  //     ws['!cols'] = wscols;
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //     const fileName = 'Articalratechange.xlsx';
  //     XLSX.writeFile(wb, fileName, { bookType: 'xlsx', type: 'binary' });
  //   });
  // }
  
  // // This code for Excel file download 
  // articalexportRatechange(event: { Id: string; }) {
 
  //   if (event.Id != "") {
  //     this.spinner.show();

  //     const newVal = event.Id;
  //     this.userService.getarticaldata(newVal).subscribe((res) => {
  //       // console.log(res);
  //       this.statuscheck = true;
  //       if (res["length"] > 0) {

          
  //         this.ArticleRate = res[0].ArticleRate;
  //         // console.log('dddJaimin RATE', res[0].ArticleRate)
          
  //         this.ArticleCat = res[0].Title;
  //         // console.log('dddJaimin CAT', this.ArticleCat)

  //         this.ArticleInDate = res[0].InwardDate;
  //         // console.log('dddJaimin DATE', this.ArticleInDate)
  //       }}
  //     )}       
  //   this.userService.getarticaldata(newVal).subscribe((res) => {
  //     //console.log(res);
  //     console.log("Jaimin",res);

  //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.articaldata);
  //     var wscols = [
  //       { width: 22.63 },
  //       { width: 11.75 }, // second column
  //       { width: 20.38 }, //...
  //       { width: 12.63 }
  //     ];
  //     ws["!cols"] = wscols;
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
  //     /* save to file */  
  //     XLSX.writeFile(wb, "Articalratechange.xlsx");
  //   });
  // }

  // articalRatechange() {
  //   console.log("Jaimin-click here");
  //   let articalData: any[]; // Declare a variable to hold the data
  //   this.userService.getarticaldata().subscribe((res) => {
  //     articalData = res; // Assign the data to the variable
  //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(articalData);
  //     // Rest of the code goes here...
  //   });
  // }
  
  

  public restrictNumeric(e: { metaKey: any; ctrlKey: any; which: number; }) {
    let input: string;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
   }


  doarticlerate() {
    // console.log('123123');
    this.spinner.show();
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.ArticleRateForm.value.UserId = userdata[0].Id;
    this.ArticleRateForm.value.ArticleId =this.ArticleRateForm.value.ArticleId.Id;
   
    // this.ArticleCatForm.value.ArticleId =this.ArticleCatForm.value.ArticleId.Id;
    // this.ArticleInDateForm.value.ArticleId =this.ArticleInDateForm.value.ArticleId.Id;
    this.userService.doArticleRateForm(this.ArticleRateForm.value).subscribe(
      userdata => {
        this.spinner.hide();
        document.getElementById('submit-button').removeAttribute('disabled');
        this.success(userdata);
      }
    );
  }

 
  cancelform() {
    // this.ArticleId.reset();
    // exit()
    // this.formrestvalue();
    this.router.navigate(['dashboard'])

  }
 
  success(data: Object) {
    if (data!= "") {
      let SonumberId = "";
      this.toastr.success('Success', 'Article Rate Change Successfully');
      this.formrestvalue();
    }
  }

 
  // $scope.exportToExcel = function(){
  //   // create a new workbook
  //   var wb = XLSX.utils.book_new();
    
  //   // create a new worksheet
  //   var ws = XLSX.utils.table_to_sheet(document.querySelector('table'));
  
  //   // add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    
  //   // save the workbook as an Excel file
  //   var filename = "export.xlsx";
  //   XLSX.writeFile(wb, filename);
  // };
  

  formrestvalue() {

  
    this.ArticleRateForm.controls['ArticleId'].reset();
    this.ArticleRateForm.controls['ArticleRate'].reset();
    this.ArticleCatForm.controls['ArticleCat'].reset();
    this.ArticleInDateForm.controls['ArticleInDate'].reset();
   // this.ArticleRateForm.controls['OutletArticleRate'].reset();
    this.statuscheck = false;
  }

  // cancelform() {
   
  //   this.formrestvalue();

  // }
 

}
function fileDowload() {
  throw new Error('Function not implemented.');
}

