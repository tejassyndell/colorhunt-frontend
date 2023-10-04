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
import { exportElement, exportOutwardElement } from '../../export-element';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';

@Component({
  selector: 'app-outlettransport',
  templateUrl: './outlettransport.component.html',
  styleUrls: ['./outlettransport.component.scss']
})
export class OutlettransportComponent implements OnInit {
  outlettransportForm: FormGroup;
  public remainingso: any = [];
  public articlelist: any = [];
  public intransitlist: any = [];
  public editarray = {};
  DropdownSO: boolean = true;
  StatusDisabled: boolean = true;
  statuscheck: boolean = false;
  getuserdata: any;
  OutwardId: any;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  partyid: number = 0;
  public partypdown: any = [];
  public transportdown: any = [];
  butDisabled: boolean = false;
  public ReceivedCurrentDate: Date;
  TotalPieces: number = 0;
  TotalPiecesflag: boolean = false;
  minDate: any;
  outwardflag: boolean = false;
  showOutwardChallan :boolean = false;


  OutwardDate: any;
  SoNumber: any;
  OutwardNumber: any;
  GSTNumber: any;
  UserName: any;
  Name: any;
  Address: any;
  PhoneNumber: any;
  Transporter: any;
  TotalNoPacks: any;
  TotalQuantityPic: any;
  TotalAmount: any;
  public challanoutwardlist: any = [];
  checkcalspan: any = [];
  UserWiseData: boolean = true;
  RoundValueSign: any;
  BorderBottomWithoutRoundOff: boolean = false;
  TotalWeight: any;
  dataList: any = [];
  dataList1: any = [];
  PartyDiscount: number;
  PartyTotalDiscount: any;
  Roundoff: boolean;
  TotalRoundAmount: any;
  AdjustAmount: any;
  Discount: any;
  TotalFinalAmount: any;
  GSTLabel: any;
  GSTValue: any;
  GSTType: any;
  GSTPercentage: any;
  SGSTValue: any;
  CGSTValue: any;
  Remarks: any;
  GSTTypeStatus: boolean = true;
  SubtotalStatus: any;
  preparedby: any;
  verifiedby: any;
  TotalQuantityAllInSet: any;
  SubTotalAmount: any;
  ExtraDiscountpercentage: any;


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();
  showOutletTransportLogs: boolean = false;
  OutletTransportLogsData: any;
  UserRole: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("Outward Goods Status | Colorhunt");
    this.outlettransportForm = this.formBuilder.group({
      PartyId: ['', [Validators.required]],
      OutwardId: ['', [Validators.required]],
      TransportStatus: ['', [Validators.required]],
      Remarks: [''],
      ReceivedDate: ['', [Validators.required]]
      //Status: ['', [Validators.required]]
    });
    this.getuserdata = JSON.parse(localStorage.getItem('logindata'));
  }

  ngOnInit() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    this.UserRole = item[0].Role;
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    this.spinner.show();
    this.ReceivedCurrentDate = new Date();
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

    if(item[0].Role==7){
      this.butDisabled = true;
    }else{
      this.butDisabled = false;
    }

    this.spinner.show();
    this.userService.getoutletparty(this.partyid).subscribe((res) => {
      this.partypdown = res;
      let PartyId = this.getuserdata[0].PartyId;
      let RoleId = this.getuserdata[0].Role;
      this.spinner.hide();
      if(RoleId==7){
        this.editarray = {
          PartyId: PartyId
        }
        //this.spinner.hide();
        this.outlettransportForm.patchValue(this.editarray);
        this.userService.getoutwardtransport(PartyId).subscribe((res) => {
          this.transportdown = res;
        });

        // this.userService.intransitlist(PartyId).subscribe((res) => {
        //   this.intransitlist = res;
        // });

        this.userService.intransitlist(PartyId).subscribe((res) => {
          const data = res;
          if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.intransitlist = data;
              // Call the dtTrigger to rerender again
              this.dtTrigger.complete();
              this.spinner.hide();
            });
          } else {
            setTimeout(() => {
              this.intransitlist = data;
              this.dtTrigger.complete();
              this.spinner.hide();
            }, 100);

          }

        });

      }else{
        //this.disebval = false;
        // this.userService.intransitlist(0).subscribe((res) => {
        //   this.intransitlist = res;
        // });

        this.userService.intransitlist(0).subscribe((res) => {
          const data = res;
          if (typeof this.dtElement !== 'undefined' && typeof this.dtElement.dtInstance !== 'undefined') {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.intransitlist = data;
              // Call the dtTrigger to rerender again
              this.dtTrigger.complete();
              this.spinner.hide();
            });
          } else {
            setTimeout(() => {
              this.intransitlist = data;
              this.dtTrigger.complete();
              this.spinner.hide();
            }, 100);

          }

        });
      }
      this.spinner.hide();
    });
  }

  onOutwardorder(value){
    this.outlettransportForm.controls['TransportStatus'].reset();
    this.outlettransportForm.controls['Remarks'].reset();

    if (value != "") {
      this.spinner.show();
      this.userService.getoutwardpieces(value).subscribe((res) => {
        this.TotalPiecesflag = true;
        this.outwardflag= true;
        this.TotalPieces = res[0].TotalPieces;
        this.ReceivedCurrentDate = new Date();
        //this.minDate = "2020-12-10";
        this.minDate = res[0].OutwardDate;
        this.spinner.hide();

      });
    }else{
      this.TotalPiecesflag = false;
      this.TotalPieces = 0;
      this.outwardflag = false;
    }
  }

  onChangePartyId(event) {
    if (event.target.value != "") {
      this.spinner.show();
      const newVal = event.target.value;

      this.userService.getoutwardtransport(newVal).subscribe((res) => {
        if(Object.keys(res).length>0){
          this.transportdown = res;
        }else{
          // this.formrestvalue();
          this.transportdown = [];
        }

      });

      this.outwardflag= false;
      this.spinner.hide();

    } else {

      this.formrestvalue();
      this.transportdown = [];
      this.spinner.hide();
      this.outwardflag= false;
    }
  }

  cancelform() {

    this.formrestvalue();
  }

  changeStatus(event, Id){
    //alert(event.target.value);
    if(Id==2 || Id==3){
      this.outlettransportForm.controls['Remarks'].reset();
     }


  }
  doProductLaunchStatus() {
    document.getElementById('submit-button').setAttribute('disabled' ,'true');
    this.spinner.show();
    let userdata = JSON.parse(localStorage.getItem('logindata'));

    this.outlettransportForm.value.UserId = userdata[0].Id;
    this.outlettransportForm.value.TotalPieces = this.TotalPieces;
    //this.outlettransportForm.value.OutwardId = this.OutwardId;
    debugger;
    this.userService.updateoutlettransportForm(this.outlettransportForm.value).subscribe(
      userdata => {
        this.userService.getoutwardtransport(this.outlettransportForm.value.PartyId).subscribe((res) => {
          if(Object.keys(res).length>0){
            this.transportdown = res;
          }else{
            // this.formrestvalue();
            this.transportdown = [];
          }
        });
        this.spinner.hide();
        this.success(userdata);
        document.getElementById('submit-button').removeAttribute('disabled');
      }
    );
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 21) {
          let parameterId = this.route.snapshot.paramMap.get('id');
          if (data[i].AddRights == 1 || data[i].EditRights == 1) {
            if (parameterId == null && data[i].AddRights == 1) {
              this.accessdenied = false;
            } else {
              if (parameterId != null && data[i].EditRights == 1) {
                this.accessdenied = false;
              } else {
                this.accessdenied = true;
              }
            }
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
        if (data[i].PageId == 28) {
          let parameterId = this.route.snapshot.paramMap.get('id');
          if (data[i].AddRights == 1 || data[i].EditRights == 1) {
            if (parameterId == null && data[i].AddRights == 1) {
              this.accessdenied = false;
            } else {
              if (parameterId != null && data[i].EditRights == 1) {
                this.accessdenied = false;
              } else {
                this.accessdenied = true;
              }
            }
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


  success(data) {
    if (data.id != "") {
      let SonumberId = "";
      this.toastr.success('Success', 'Outward receive successfully');
      this.ngOnInit();
      this.formrestvalue();
    }
  }

  formrestvalue() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if(item[0].Role==2){
      this.outlettransportForm.controls['PartyId'].reset([null]);
    }

    this.ReceivedCurrentDate = new Date();
    this.outlettransportForm.controls['OutwardId'].reset([null]);
    this.outlettransportForm.controls['TransportStatus'].reset();
    this.outlettransportForm.controls['Remarks'].reset();
    this.statuscheck = false;
    this.TotalPiecesflag = false;
    this.TotalPieces = 0;
    this.outwardflag= false;
  }

  public printoutwardchallan(id) {
    this.spinner.show()
    // this.router.navigate(['outwardchallan', { OWNO: id }])
    this.userService.getoutwardchallen(id).subscribe((res) => {
      this.getoutwardchallen(res);
    });
  }

  goBack (){
    window.history.back();
  }


  public getoutwardchallen(res) {
    this.showOutwardChallan = true;
    this.dataList = [
      {
        pname: "New",
        numbers: ["Changssssss"],
        data1: ["dddd"]
      },
      {
        pname: "abc",
        numbers: [123, 234, 234, 231],
        data1: [2, 33, 44, 24]
      },
      {
        pname: "change",
        numbers: [123, 234, "", 231],
        data1: [2, "", 44, ""]
      },
      {
        pname: "mno",
        numbers: [125, 237],
        data1: [2, 43]
      }
    ];

    this.dataList1 = res[2];


    this.OutwardDate = res[0][0].OutwardDate;
    this.UserName = res[0][0].UserName;
    this.Name = res[0][0].Name;
    this.Address = res[0][0].Address;
    this.PhoneNumber = res[0][0].PhoneNumber;
    this.GSTNumber = res[0][0].GSTNumber;
    this.OutwardNumber = res[0][0].OutwardNumber;
    this.SoNumber = res[0][0].SoNumber;
    this.Transporter = res[0][0].Transporter;
    this.PartyDiscount = res[0][0].PartyDiscount;
    this.Remarks = res[0][0].Remarks;

    this.Roundoff = res[1].RoundOff.Roundoff;
    if (this.Roundoff) {
      this.BorderBottomWithoutRoundOff = false;
    } else {
      this.BorderBottomWithoutRoundOff = true;
    }

    this.RoundValueSign = res[1].RoundOff.RoundValueSign;
    this.TotalRoundAmount = res[1].RoundOff.TotalRoundAmount;
    this.AdjustAmount = res[1].RoundOff.AdjustAmount;

    this.TotalNoPacks = res[1]['TotalNoPacks'];
    this.TotalQuantityPic = res[1]['TotalQuantityPic'];
    this.TotalAmount = res[1]['TotalAmount'];

    // let val = parseFloat(this.TotalAmount);
    // if(isNaN(val)){
    //   alert("not a float!");
    // } else{
    //   alert("not a float!");
    // }


    //isIntCheck(this.TotalAmount);
    this.SubtotalStatus = res[1]['SubtotalStatus'];
    this.PartyTotalDiscount = res[1]['PartyTotalDiscount'];

    this.TotalQuantityAllInSet = res[1]['TotalQuantityAllInSet'];
    this.TotalWeight = res[1]['TotalWeight'];
    this.Discount = res[1]['Discount'];
    this.ExtraDiscountpercentage = res[1]['ExtraDiscountpercentage'];
    this.TotalFinalAmount = res[1]['TotalFinalAmount'];
    this.GSTLabel = res[1]['GSTLabel'];
    this.GSTValue = res[1]['GSTValue'];
    this.SGSTValue = res[1]['SGSTValue'];
    this.CGSTValue = res[1]['CGSTValue'];
    this.GSTPercentage = res[1]['GSTPercentage'];
    this.GSTType = res[1]['GSTType'];
    this.SubTotalAmount = res[1]['SubTotalAmount'];


    if (this.GSTType == "GST") {
      this.GSTTypeStatus = true;
      this.GSTPercentage = (this.GSTPercentage / 2);
      //alert(this.GSTValue);
      //this.GSTValue = (this.GSTValue/2);
      //alert(this.GSTValue);
    } else {
      this.GSTTypeStatus = false;
      // alert(this.GSTPercentage);
    }

    this.challanoutwardlist = res;
    let outwardlist1 = res[0];

    this.preparedby = res[0][0].PreparedUserName;

    let item = JSON.parse(localStorage.getItem('userdata'));
    this.verifiedby = item[0].Name;

    let outwardlist12: any;
    var Count1 = Object.keys(outwardlist1).length;

    this.spinner.hide();

  }
  isIntCheck(n) {
    return Number(n) === n && n % 1 === 0;
  }

  public captureScreen() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }


  pdf(element) {
    $(".rupeesymbol").replaceWith("Rs.");
    //alert(this.Name);
    //exportOutwardElement(element, this.Name);
    exportOutwardElement(element, this.Name, { paperSize: "A4", scale: 0.6, repeatHeaders: true });
    //exportOutwardElement(element, this.Name, { paperSize: "A4",scale: 0.5});
    // this.ngOnInit();
  }
  public viewlogs(id) {
    this.showOutletTransportLogs = true;
    this.userService.outlettransportlogs(id).subscribe((res) => {
      this.OutletTransportLogsData = res;
    });
  }
  CloseLogs() {
    this.showOutletTransportLogs = false;
  }

  challangoBack() {
    this.showOutwardChallan = false;
    // window.history.back();
  }

}



