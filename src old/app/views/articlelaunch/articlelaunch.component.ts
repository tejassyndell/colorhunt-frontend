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


@Component({
  selector: 'app-articlelaunch',
  templateUrl: './articlelaunch.component.html',
  styleUrls: ['./articlelaunch.component.scss']
})
export class ArticlelaunchComponent implements OnInit {



  ArticleRateForm: FormGroup;

  dropdownSettings = {};

  // public selectedItems = [];
  selectedItems: any[] = [];

  isAllPartySelected : boolean = false;
  public remainingso: any = [];
  public articlelist: any = [];
  public partylist: any = [];
  public editarray = {};
  DropdownSO: boolean = true;
  StatusDisabled: boolean = true;
  statuscheck: boolean = false;
  statuscheckparty: boolean = false;
  getuserdata: any;
  ArticleRate: any;
  ArticleLaunchDate: any;
  articaldata: any;
  ArticleCat: any;
  ArticleInDate: any;

  PrintArticleRate: any;
  submitted = false;
  
  //OutletArticleRate: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  ArticleId:any;
  PartyId:any;
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
      ArticleInDate: ['', [Validators.required, this.validateDate]],
      PartyId: ['', [Validators.required]],

    //  OutletArticleRate: ['', [Validators.required]]
    });
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
  }


  validateDate(control: any) {
    const selectedDate = control.value;
    if (!selectedDate) {
      return { noDate: true }; // Return an error object if no date is selected
    }
    return null; // Return null if the validation passes
  }

  ngOnInit() {
    

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: true,
      allowSearchFilter: true
    }


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
    this.userService.withoutopenflagarticallist().subscribe((res) => {
      this.articlelist = res;
    });

    this.userService.partylist().subscribe((res) => {
      // console.log('sdfsdfsdf', res)
      this.partylist = res;
    });
  }

  }



  OnPartySelect(item) {
    this.selectedItems.push(item);
    this.PartyId = this.selectedItems
    // console.log('Added', this.selectedItems)
  }


  OnPartySelectAll(item) {
    // console.log('All items selected:', item);
    this.isAllPartySelected = true
  }

  OnPartyDeSelectAll(item) {
    // console.log('All items de selected:', item);
    this.isAllPartySelected = false
  }

  OnPartyDeSelect(item: Object) {
  
      const inputname = 'NoPacks_' + item["Id"];
      this.ArticleRateForm.removeControl(inputname);

      let i = 0;
      let selectedItems1 = [];
      selectedItems1 = this.selectedItems;
      var Count = Object.keys(selectedItems1).length;
      let cdown;
      for (i = 0; i < Count; i++) {
        if (selectedItems1[i].Id == item['Id']) {
          cdown = i;
        }
      }
      this.selectedItems.splice(cdown, 1);

    this.PartyId = this.selectedItems


      // console.log('Delete', this.selectedItems)
  }

  cancelform() {
    this.router.navigate(['articlelaunchlist'])
  }

  rightscheck(data: string | Object, no: number) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 39) {
          if (data[i].EditRights == 1) {
            this.accessdenied = false;
          } else {
            this.accessdenied = false;
          }
          this.isList = data[i].ListRights;
          this.isAdd = data[i].AddRights;
          this.isEdit = data[i].EditRights;
          this.isDelete = data[i].DeleteRights;
          break;
        } else {
          this.accessdenied = false;
        }

      }
    } else {


    }
  }
  


  onChangePartyId(event) {
    // debugger;
    this.PartyId = event.Id
    // console.log('ddd', event.Id)

  }








  
  onChangeArticle(event: { Id: string; }) {
   
    if (event.Id != "") {

      this.spinner.show();      
      this.statuscheckparty = true;

      this.userService.partylist().subscribe((res) => {
        // console.log('sdfsdfsdf', res)
        this.partylist = res;
      });
    
      const newVal = event.Id;
      this.PrintArticleRate = newVal;
      // console.log(event.Id)
      this.userService.getanarticaldata(newVal).subscribe((res) => {
        // console.log('Here',res)
        this.statuscheck = true;

        if (res["length"] > 0) {

          this.ArticleRate = res[0].ArticleRate;
          
          // console.log('dddJaimin RATE', res[0].ArticleRate)
          this.ArticleInDate = "";
          this.PartyId = "";
          
          this.ArticleCat = res[0].Title;
          // console.log('dddJaimin CAT', this.ArticleCat)

          // this.ArticleInDate = res[0].InwardDate;
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

  }  

 
  

  

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


   doarticlelaunch() {
    // console.log('123123');

    this.submitted = true;

    if (this.ArticleRateForm.invalid) {
      // Display validation error messages
      return;
    }


    // console.log('123123');
    this.spinner.show();

    let userdata = JSON.parse(localStorage.getItem('logindata'));

    
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    
    this.ArticleRateForm.value.UserId = userdata[0].Id;
    this.ArticleRateForm.value.ArticleId = this.ArticleRateForm.value.ArticleId.Id;

    if(this.isAllPartySelected){
      this.ArticleRateForm.value.PartyId = 0;
    }else{
      this.ArticleRateForm.value.PartyId = this.PartyId;
    }

    
    // console.log('All data', this.ArticleRateForm.value, 'All data');
    
    this.userService.doArticleLaunchForm(this.ArticleRateForm.value).subscribe(
      userdata => {
        this.spinner.hide();
        document.getElementById('submit-button').removeAttribute('disabled');
        this.success(userdata);
      }
    );
    
    this.ArticleRateForm.get('PartyId').setValue('');
    this.ArticleRateForm.get('ArticleInDate').setValue('');

    this.statuscheck = false;
    this.statuscheckparty = false;

    this.spinner.hide()

   


    

  }

  success(data: Object) {
    if (data!= "") {
      let SonumberId = "";
      this.toastr.success('Success', 'Article Launched Successfully');
      this.formrestvalue();
    }
  }

 

  

  formrestvalue() {

    this.ArticleId =null
    this.PartyId =null
  
    this.ArticleRateForm.controls['ArticleId'].reset();
    this.ArticleRateForm.controls['PartyId'].reset();
    this.ArticleRateForm.controls['ArticleRate'].reset();

    this.ArticleRateForm.controls['ArticleLaunchDate'].reset();

    this.ArticleCatForm.controls['ArticleCat'].reset();
    // this.ArticleInDateForm.controls['ArticleInDate'].reset();
   // this.ArticleRateForm.controls['OutletArticleRate'].reset();
    this.statuscheck = false;
  }

}
