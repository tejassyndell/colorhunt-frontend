import { Component, OnInit } from "@angular/core";
import { RouterModule, Routes, Router, ActivatedRoute } from "@angular/router";
import { UserService } from "../../services/user.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Title } from "@angular/platform-browser";
import { exportStElement } from '../../export-element';

@Component({
  selector: "app-stocktransferchallan",
  templateUrl: "./stocktransferchallan.component.html",
  styleUrls: ["./stocktransferchallan.component.scss"],
})
export class StocktransferchallanComponent implements OnInit {
  UserWiseData: boolean = true;
  getID: string;
  getuserdata: any;
  stBack: any;
  UserName: any;
  STDate: any;
  STNumber: any;
  Remarks: any;
  TotalConsumedNoPacks: any;
  TotalTransferNoPacks: any;

  public stocktransferlist: any = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private titleService: Title
  ) {
    this.titleService.setTitle("ST Challan | Colorhunt");
  }

  ngOnInit() {
    this.getuserdata = JSON.parse(localStorage.getItem("logindata"));
    let data = this.route.snapshot.paramMap.get("STNO");
    let backgetval = this.route.snapshot.paramMap.get("Back");
    if (backgetval == "1") {
      this.stBack = 1;
    } else if (backgetval == "2") {
      this.stBack = 2;
    } else if (backgetval == "4") {
      this.stBack = 4;
    } else {
      this.stBack = 3;
    }

    this.getID = this.route.snapshot.paramMap.get("STNO");
    if (this.route.snapshot.paramMap.get("STNO")) {
      this.userService
        .stocktransferdatacheckuserwise(this.getuserdata[0].Id, data)
        .subscribe((res) => {
          if (res["Rights"]) {
            this.UserWiseData = true;
            this.spinner.show();
            this.userService.getstocktransferchallen(data).subscribe((res) => {
              this.TotalConsumedNoPacks = res["TotalConsumedNoPacks"];
              this.TotalTransferNoPacks = res["TotalTransferNoPacks"];
              this.getstocktransferchallen(res["data"]);
            });
          } else {
            this.UserWiseData = false;
          }
        });
    }
  }

  public getstocktransferchallen(res) {
    this.UserName = res[0].UserName;
    this.STDate = res[0].STDate;
    this.STNumber = res[0].STNumber;
    this.Remarks = res[0].Remarks;
    // this.ConsumedArticleNumber = res[0].ConsumedArticleNumber;
    // this.ConsumedNoPacks = res[0].ConsumedNoPacks;
    // this.TotalConsumedNoPacks = res[0].TotalConsumedNoPacks;
    // this.TransferArticleNumber = res[0].TransferArticleNumber;
    // this.TransferNoPacks = res[0].TransferNoPacks;
    // this.TotalTransferNoPacks = res[0].TotalTransferNoPacks;
    this.stocktransferlist = res;
    this.spinner.hide();
  }
  pdf(element) {
    exportStElement(element, 'StockTransfer', {
      paperSize: "A4",
      scale: 0.4,
      repeatHeaders: true,
    });
    this.ngOnInit();
    this.spinner.hide();
  }
  goBack (){
    window.history.back();
  }
}
