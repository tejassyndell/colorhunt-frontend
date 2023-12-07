import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import * as XLSX from "xlsx";
import { DatePipe } from "@angular/common";


@Component({
  selector: 'app-outletrefil',
  templateUrl: './outletrefil.component.html',
  styleUrls: ['./outletrefil.component.scss']
})
export class outletrefilComponent implements OnInit {
  getsallstocks: any;
  public partypdown: any = [];
  outletreportgetdata: Boolean = false;
  ApiURL: string = environment.apiURL;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  partyid: number = 0;





  public categories: any;
  public fcategories: any;
  public inwardlist: any;
  public outletInwardlist: any;
  public outletImportlist: any;
  public latdate: any;
  public outwardlist: any;
  public outletOutwardlist: any;
  public outletJhsplOutwardlist: any;
  public prlist: any;
  public srlist: any;
  public outletPRlist: any;
  public outletSRlist: any;
  public catinwardlist: any;
  public catoutwardlist: any;
  public catprlist: any;
  public catsrlist: any;
  public outletCatInwardlist: any;
  public outletCatImportlist: any;
  public outletCatOutwardlist: any;
  public outletCatPRlist: any;
  public outletCatSRlist: any;
  public outletCatInwardTotal:any;
  public outletCatImportTotal:any;
  public outletCatOutwardTotal:any;
  public outletCatPRTotal:any;
  public outletCatSRTotal:any;
  public showData: boolean = false;
  public outletShowData: boolean = false;
  public opening: any;
  public RangeDate: any;
  public closing: any;
  public OpeningCat: any;
  public ClosingCat: any;
  public outletOpening: any;
  public fOpening: any;
  public outletTotalStyle: any;
  public fTotalStyle: any;
  public outletClosing: any;
  public fClosing: any;
  public CategoryWiseStock: any;
  public outletOpeningCat: any;
  public fOpeningCat: any;
  public outletClosingCat: any;
  public fClosingCat: any;
  public TotalCategoryStock: any;
  public totalInwards: any;
  public totalOutwards: any;
  public totalPurchaseReturns: any;
  public totalSalesReturn: any;
  public outletInwardTotal: any;
  public outletImportTotal: any;
  public outletOutwardTotal: any;
  public outletSRTotal: any;
  public outletPRTotal: any;
  public categoryShow: boolean = false;
  public outletCategoryShow: boolean = false;
  public AllStockCatShow: boolean = false;
  public OpeningCategory: boolean = false;
  public ClosingCategory: boolean = false;
  public outletOpeningCategory: boolean = false;
  public outletClosingCategory: boolean = false;
  public fClosingCategory: boolean = false;
  public inCatShow: boolean = false;
  public ouCatShow: boolean = false;
  public prCatShow: boolean = false;
  public srCatShow: boolean = false;
  public OutletinCatShow: boolean = false;
  public OutletimpCatShow: boolean = false;
  public OutletouCatShow: boolean = false;
  public OutletprCatShow: boolean = false;
  public OutletsrCatShow: boolean = false;
  OutletPartyId: any;
  public partydropdown: any = [];
  public alldata;
  public orgOutletName: any;
  public op: any;
  public fop: any;
  flagstockdata: boolean = false;


  accessdenied: boolean = false;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  Outletpermissions: boolean = false;
  AllReportpermissions: boolean = false;



    dtTrigger: Subject<any> = new Subject<any>();
  constructor(private userService: UserService, public router: Router, private spinner: NgxSpinnerService,private titleService: Title, private datePipe: DatePipe) {

    this.titleService.setTitle("Outlet Refil | Colorhunt");
  }

  ngOnInit(): void {
    let item = JSON.parse(localStorage.getItem('userdata'));

    if(item[0].Role==7){
      this.AllReportpermissions = false;
      this.Outletpermissions = true;
    } else{
      this.AllReportpermissions = true;
    }
  
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }

    if(item[0].Role==2){
      this.partyid = 0;
    }else{
      this.partyid = item[0].PartyId;
    }
    this.userService.getoutletpartyoutletreport(this.partyid).subscribe((res) => {
      this.partypdown = res;
    });



    
    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    // console.log(formattedDate); // Outputs something like "2023-05-12"

    this.spinner.show();
    this.RangeDate = formattedDate;
    // console.log('sfdsdfsdfsd', event.target.value)
    this.OutletPartyId = 4

      this.userService
        .getsoutletreport(
          this.RangeDate,
          this.OutletPartyId
        )
        .subscribe((res) => {
          // console.log('mmmm',res)
          this.spinner.hide();
          this.showData = false;
          this.outletShowData = true;
          // this.orgOutletName = 'l';
          this.fop = 'Factory' ;
          this.fOpeningCat = res["outletOpeningCategorywise"];
          this.fTotalStyle = res["TotalStyle"];
          // console.log('lplplplplplppll', res["TotalStyle"])
          this.fClosingCat = res["outletClosingCategorywise"];
          this.fcategories = res["Categories"];
          this.fOpening = res["outletOpeningStock"];
          this.fClosing = res["outletClosingStock"];

     
        });



        setTimeout(() => {
          const newVal = this.OutletPartyId;
          this.outletreportgetdata = true;
          const dataUrl = this.ApiURL + "/getoutletstocksRefil/" + newVal;
          this.dtOptions = {
            ajax: dataUrl,
            columns: [{
              title: 'No',
              data: 'ArticleNumber'
            }, {
              title: 'Article No',
              data: 'ArticleNumber'
            }, {
              title: 'Category',
              data: 'Title'
            },
            {
              title: 'Brand',
              data: 'BrandName',
              class: 'none'

            },
            {
              title: 'Colorwise Qty',
              data: 'SalesNoPacks'
            },
            {
              title: 'Total Qty',
              data: 'TotalPieces'
            },
            {
              title: 'Article Color',
              data: 'ArticleColor',
              class: 'none'
            }, {
              title: 'Article Size',
              data: 'ArticleSize',
              class: 'none'
            }, {
              title: 'Article Ratio',
              data: 'ArticleRatio',
              class: 'none'
            },
            {
              title: 'Sub-Category',
              data: 'Subcategory',
              class: 'none'
            },
            {
              title: 'Style Description',
              data: 'StyleDescription',
              class: 'none'
            }
            ],
            dom: "lBfrtip",
            // Configure the buttons
            buttons: [
              { extend: 'copy', className: 'reportbutton' },
              { extend: 'print', className: 'reportbutton' },
              { extend: 'excel', className: 'reportbutton' }
            ],
            // Use this attribute to enable the responsive extension
            //className: 'table-button button btn btn-success',
            responsive: true
          };
  
          this.spinner.hide();
        }, 500);




  }

  hideOutletOpeningClosing() {
    this.outletOpeningCategory = false;
    this.outletClosingCategory = false;
  }

  hidefOpeningClosing() {
    this.fClosingCategory = false;
  }

  outletOpeningCategoryw() {
    this.outletOpeningCategory = true;
  }

  outletClosingCategoryw() {
    this.outletClosingCategory = true;
  }

  fClosingCategoryw() {
    this.fClosingCategory = true;
  }




  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        
        if (data[i].PageId == 49) {
          if (data[i].ListRights == 1) {
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
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageId == 49) {
          if (data[i].ListRights == 1) {
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

    }
  }



  onChangePartyId(event) {

    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    // console.log(formattedDate); // Outputs something like "2023-05-12"

    this.spinner.show();
    this.RangeDate = formattedDate;
    // console.log('sfdsdfsdfsd', event.target.value)
    this.OutletPartyId = event.target.value

      this.userService
        .getsoutletreport(
          this.RangeDate,
          this.OutletPartyId
        )
        .subscribe((res) => {
          // console.log(res)
          this.spinner.hide();
          this.showData = false;
          this.outletShowData = true;
          // this.orgOutletName = 'l';
          this.op = res['orgOutletName'];
          this.outletTotalStyle = res["TotalStyle"];
          this.outletOpeningCat = res["outletOpeningCategorywise"];
          this.outletClosingCat = res["outletClosingCategorywise"];
          this.categories = res["Categories"];
          this.outletOpening = res["outletOpeningStock"];
          this.outletClosing = res["outletClosingStock"];
          this.outletInwardlist = res["allOutletData"].inwardData;
          this.outletInwardTotal = res["allOutletData"].totalInwardPacks;
          this.outletImportlist = res["allOutletData"].importData;
          this.outletImportTotal = res["allOutletData"].totalImportPacks;
          this.outletOutwardlist = res["allOutletData"].outwardData;
          this.outletJhsplOutwardlist = res["allOutletData"].jhsploutwardData;
          this.outletOutwardTotal = res["allOutletData"].totalOutwardPacks;
          this.outletPRlist = res["allOutletData"].purchaseReturnData;
          this.outletPRTotal = res["allOutletData"].totalPurchaseReturnPacks;
          this.outletSRlist = res["allOutletData"].salesReturnData;
          this.outletSRTotal = res["allOutletData"].totalSalesReturnPacks;
          this.outletCatInwardlist = res["allOutletDataCat"].outletInwardCategoryWise;
          this.outletCatInwardTotal = res["allOutletDataCat"].totalCatInwardPacks;
          this.outletCatImportlist = res["allOutletDataCat"].outletImportCategoryWise;
          this.outletCatImportTotal = res["allOutletDataCat"].totalCatImportPacks;
          this.outletCatOutwardlist = res["allOutletDataCat"].outletOutwardCategoryWise;
          this.outletCatOutwardTotal = res["allOutletDataCat"].totalCatOutwardPacks;
          this.outletCatPRlist = res["allOutletDataCat"].outletPurchaseReturnCategoryWise;
          this.outletCatPRTotal = res["allOutletDataCat"].totalCatPRPacks;
          this.outletCatSRlist = res["allOutletDataCat"].outletSalesReturnCategoryWise;
          this.outletCatSRTotal = res["allOutletDataCat"].totalCatSRPacks;
          // console.log('LOShdp', res["allOutletDataCat"].totalCatSRPacks)
        });
    


    this.outletreportgetdata = false;
    if (event.target.value != "") {
      this.spinner.show();
      setTimeout(() => {
        const newVal = event.target.value;
        this.outletreportgetdata = true;
        const dataUrl = this.ApiURL + "/getoutletstocksRefil/" + newVal;
        this.dtOptions = {
          ajax: dataUrl,
          columns: [{
            title: 'No',
            data: 'Id'
          }, {
            title: 'Article No',
            data: 'ArticleNumber'
          }, {
            title: 'Category',
            data: 'Title'
          },
          {
            title: 'Brand',
            data: 'BrandName',
            class: 'none'

          },
          {
            title: 'Colorwise Qty',
            data: 'SalesNoPacks'
          },
          {
            title: 'Total Qty',
            data: 'TotalPieces'
          },
          {
            title: 'Outlet Colorwise Qty',
            data: 'OLSTOCKS'
          },
          {
            title: 'Outlet Total Qty',
            data: 'OLTotalPieces'
          },
          {
            title: 'Total Outward Qty',
            data: 'outwd'
          },
          {
            title: 'Article Color',
            data: 'ArticleColor',
            class: 'none'
          }, {
            title: 'Article Size',
            data: 'ArticleSize',
            class: 'none'
          }, {
            title: 'Article Ratio',
            data: 'ArticleRatio',
            class: 'none'
          },
          {
            title: 'Sub-Category',
            data: 'Subcategory',
            class: 'none'
          },
          {
            title: 'Style Description',
            data: 'StyleDescription',
            class: 'none'
          }
          ],
          dom: "lBfrtip",
          // Configure the buttons
          buttons: [
            { extend: 'copy', className: 'reportbutton' },
            { extend: 'print', className: 'reportbutton' },
            { extend: 'excel', className: 'reportbutton' }
          ],
          // Use this attribute to enable the responsive extension
          //className: 'table-button button btn btn-success',
          responsive: true
        };

        this.spinner.hide();
      }, 500);

    } else {
      this.outletreportgetdata = false;
      this.spinner.hide();
    }
  }























  // outletOpeningCategoryw() {
  //   console.log('JJJJ')
  //   this.outletOpeningCategory = true;
  // }
  // outletClosingCategoryw() {
  //   this.outletClosingCategory = true;
  // }




}
