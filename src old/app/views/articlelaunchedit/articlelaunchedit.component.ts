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
  selector: 'app-articlelaunchedit',
  templateUrl: './articlelaunchedit.component.html',
  styleUrls: ['./articlelaunchedit.component.scss']
})
export class ArticlelauncheditComponent implements OnInit {

  ArticleRateForm: FormGroup;

  public remainingso: any = [];
  public articlelist: any = [];
  public partylist: any = [];
  public editarray = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;


  dropdownSettings = {};
  selectedItems: any[] = [];
  isAllPartySelected : boolean = false;


  DropdownSO: boolean = true;
  StatusDisabled: boolean = true;
  statuscheck: boolean = false;
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
  UserWiseData: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  ArticleId:any;
  PartyId:any;
  aid:any;
  pid:any;
  ArticleCatForm: any;
  ArticleInDateForm: any;
  articlesArray: any;
  dropdownData: any = []
  public forcom: any = []
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService ,private titleService: Title) {
    this.titleService.setTitle("Change Article Rate | Colorhunt");
    this.ArticleRateForm = this.formBuilder.group({
      // console.log('dddJaimin CAT', this.ArticleRateForm);
      ArticleId: ['', [Validators.required]],
      ArticleRate: ['', [Validators.required, Validators.min(1)]],
      ArticleCat: ['', [Validators.required, Validators.min(1)]],
      ArticleInDate: ['', [Validators.required, Validators.min(1)]],
      PartyId: ['', [Validators.required]],
      aid: ['', [Validators.required, Validators.min(1)]],
      pid: ['', [Validators.required, Validators.min(1)]],
      

    //  OutletArticleRate: ['', [Validators.required]]
    });
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
  }

  onChangePartyId(event) {
    // debugger;
    this.pid = event.Id
    // console.log('d44dd', event.Id)

  }



  ngOnInit() {

    
      console.log('qwqw',this.route.snapshot.paramMap.get('id'))
      console.log('AccessCheck:', this.accessdenied); // Verify that it's true

    this.userService.partylist().subscribe((res1) => {
      
      this.dropdownData = res1;
      // this.forcom = res1;


      // console.log('SELECTED DATA', this.dropdownData)
      localStorage.setItem('chch', JSON.stringify(res1));
  
  
      // console.log('......................lll................', item)
    });


    




    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      enableCheckAll: true,
      allowSearchFilter: true
    }

 
    this.userService.getarticallauncheditdata(this.route.snapshot.paramMap.get('id')).subscribe((res) => {
      // const data = res 
       
      // console.log('SELECTED DATA', res)
      this.ArticleId = res[0].ArticleNumber;
      this.ArticleCat = res[0].Title;
      this.ArticleRate = res[0].ArticleRate;
      this.PartyId = res[0].Name;
      this.ArticleInDate = res[0].LaunchDate ;
      this.aid = this.route.snapshot.paramMap.get('id') ;
      this.pid = res[0].PartyId;
      
      if(res[0].PartyId != 0){
        this.isAllPartySelected = false
        let itemdd = JSON.parse(localStorage.getItem('chch'));

        // console.log('------------',res);


        // this.selectedItems = res.map(item => {
        //   return itemdd.find(dropdownItem => dropdownItem.Id === item.PartyId);
        // });

        if (Array.isArray(res)) {
          this.selectedItems = res.map(item => {
            return itemdd.find(dropdownItem => dropdownItem.Id === item.PartyId);
          });
        } else {
          
          // Handle the case when res is not an array
        }
        

        this.PartyId = this.selectedItems

        // console.log('all data',itemdd);
        // console.log('Spacific data',this.selectedItems);
      }else{
        // console.log('all selected!!!')
        this.isAllPartySelected = true
        this.selectedItems = [this.dropdownData]
        // console.log('d',this.selectedItems);


        let itemdd = JSON.parse(localStorage.getItem('chch'));

        this.selectedItems = itemdd.map(item => {
          return itemdd.find(dropdownItem => dropdownItem.Id === item.Id);
        });
      }

    })


    



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
      this.UserWiseData = true;

    });


  }

  }

  cancelform() {
    this.router.navigate(['articlelaunchlist'])
  }



  OnPartySelect(item) {
    this.isAllPartySelected = false
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
  
    this.isAllPartySelected = false


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


    }
  }

  onChangeParty() {
    // console.log('sdfsdfsdfsdf')
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

    this.submitted = true;

    if (this.ArticleRateForm.value.PartyId == null || this.ArticleRateForm.value.PartyId == 0 || this.ArticleRateForm.value.PartyId == undefined) {
      return;
    }

 

    this.spinner.show();

    let userdata = JSON.parse(localStorage.getItem('logindata'));

    
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    
    this.ArticleRateForm.value.UserId = userdata[0].Id;
    this.ArticleRateForm.value.ArticleId =this.aid;

    if(this.isAllPartySelected){
      this.ArticleRateForm.value.PartyId = 0;
    }else{
      this.ArticleRateForm.value.PartyId = this.PartyId;
    }
    
    // console.log('sdfdsf', this.ArticleRateForm.value, 'sdfsdfsdf');
    
    this.userService.editarticlelaunch(this.ArticleRateForm.value).subscribe(
      userdata => {
        this.spinner.hide();
        document.getElementById('submit-button').removeAttribute('disabled');
        this.success(userdata);
      }
    );
    this.spinner.hide();

    this.router.navigate(['articlelaunch'])


  }



  success(data: Object) {
    if (data!= "") {
      let SonumberId = "";
      this.toastr.success('Success', 'Article Launch Updated');
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

