import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { JsonPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-socart',
  templateUrl: './socart.component.html',
  styleUrls: ['./socart.component.scss']
})

export class SocartComponent implements OnInit {
  cartitem: any = [];
  newcartitem: any = [];
  finalarray: any = [];
  public size = [];
  public color = [];
  public rate = [];
  demo: any = []
  public newsize = "";
  public newcolor = "";
  public Total = 0;
  nodata: boolean = false;
  thanks: boolean = false;
  soFrontForm: FormGroup;
  SoCurrentDate: Date;
  public partypdown: any = [];
  uploadURL: string = environment.getuploadURL;
  soID: any;
  pdficon: boolean = false;
  accessdenied: boolean = true;
  isList: any;
  isAdd: any;
  isEdit: any;
  isDelete: any;
  GSTType: string = 'GST';

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private toastr: ToastrService, private route: ActivatedRoute, private spinner: NgxSpinnerService,private titleService: Title) {
    this.titleService.setTitle("SO Cart | Colorhunt");
    let cartavi = localStorage.getItem('Cartavailable');
    if (localStorage.getItem('CartIteam') !== null) {
      let item = JSON.parse(localStorage.getItem('CartIteam')).length;
      if (item > 0) {
        this.nodata = false;
      } else {

        if (cartavi == '1') {
          this.nodata = true;
          this.thanks = true;
        } else {
          this.nodata = true;
        }
      }
    } else {
      if (cartavi == '1') {
        this.nodata = true;
        this.thanks = true;
      } else {
        this.nodata = true;
      }
    }

    this.soFrontForm = this.formBuilder.group({
      Date: [''],
      PartyId: ['', [Validators.required]],
      Destination: ['', [Validators.required]],
      Remarks: [''],
      Transporter: ['', [Validators.required]],
      GST: [''],
      GST_Percentage: ['', [Validators.min(0),Validators.max(50)]],
      GSTType: ['']
    })
  }

  ngOnInit() {
    document.body.className = 'app sidebar-hidden sidebar-fixed aside-menu-fixed aside-menu-hidden';

    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));

    if (rolerights != "" && rolerights != null && rolerights !== undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
    this.SoCurrentDate = new Date();
    this.userService.partylist().subscribe((res) => {
      this.partypdown = res;
    });
    if (localStorage.getItem('CartIteam') !== null) {
      let item = JSON.parse(localStorage.getItem('CartIteam'));
      this.cartitem = item;
    }

    var total = 0;
    for (let index = 0; index < this.cartitem.length; index++) {
      var flag = this.cartitem[index].ArticleData[0].ArticleOpenFlag;
      let body;
      if (flag == 0) {
        this.newcartitem = this.cartitem[index];
        this.size = JSON.parse(this.cartitem[index].ArticleData[0].ArticleSize);
        this.color = JSON.parse(this.cartitem[index].ArticleData[0].ArticleColor);
        for (let j = 0; j < this.size.length; j++) {
          this.newsize = this.newsize + this.size[j].Name + ",";
        }
        var sizestr = this.newsize.substring(0, this.newsize.length - 1);

        for (let j = 0; j < this.color.length; j++) {
          this.newcolor = this.newcolor + this.color[j].Name + ",";
        }
        var colorstr = this.newcolor.substring(0, this.newcolor.length - 1);

        //Sum Of Rate

        total = Number(total) + Number(this.cartitem[index].Amount);
        this.Total = total;
        this.newsize = "";
        this.newcolor = "";
        var ia = ""
        if (this.cartitem[index].ArticleData[0].Images != "" && this.cartitem[index].ArticleData[0].Images != null) {
          var str = this.cartitem[index].ArticleData[0].Images;
          var str_array = str.split(',');
          for (var i = 0; i < str_array.length; i++) {
            // Trim the excess whitespace.
            str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
            ia = this.uploadURL + str_array[0];
          }
        } else {
          ia = 'assets/img/no-image-available.png'
        }

        body = {
          "Id": this.cartitem[index].ArticleData[0].Id,
          "ArticleNumber": this.cartitem[index].ArticleData[0].ArticleNumber,
          "ArticleRate": this.cartitem[index].Amount,
          "ArticleRatio": this.cartitem[index].ArticleData[0].ArticleRatio,
          "ArticleSize": sizestr,
          "ArticleColor": colorstr,
          "Images": ia,
          "Title": this.cartitem[index].ArticleData[0].Title,
          "SalesNoPacks": this.cartitem[index].ArticleData[0].SalesNoPacks,
          "RequiredNoPacks": this.cartitem[index].RequiredNoPacks,
          "TotalNoPacks": this.cartitem[index].TotalNoPacks,
          "Total": total
        }
      } else {
        //Sum Of Rate
        total = Number(total) + Number(this.cartitem[index].Amount);
        this.Total = total;
        body = {
          "Id": this.cartitem[index].ArticleData[0].Id,
          "ArticleNumber": this.cartitem[index].ArticleData[0].ArticleNumber,
          "ArticleOpenFlag": flag,
          "Images": 'assets/img/no-image-available.png',
          "ArticleRate": this.cartitem[index].Amount,
          "NoPacks": this.cartitem[index].ArticleData[0].NoPacks,
          "RequiredNoPacks": this.cartitem[index].RequiredNoPacks,
          "TotalNoPacks": this.cartitem[index].TotalNoPacks,
          "Total": total
        }

      }

     // alert(this.cartitem[index].RequiredNoPacks.split(','));
     // alert(this.cartitem[index].RequiredNoPacks);

      this.finalarray.push(body)


    }




  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));

    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 26) {
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
        if (data[i].PageId == 26) {
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


  gotoDetails(id) {
    this.router.navigate(['sofrontdetails', { id: id }]);
  }

  objectKeys(obj) {
    var ids = [];

    this.size = JSON.parse(obj);
    for (let index = 0; index < this.size.length; index++) {
      this.newsize = this.newsize + this.size[index].Name + ",";
    }
    var str = this.newsize;
    var str2 = str.substring(0, str.length - 1);

  }

  removecartdata(i) {
    let removevl = i;
    this.cartitem = [];
    for (i = 0; i < JSON.parse(localStorage.getItem('CartIteam')).length; i++) {
      let val = JSON.parse(localStorage.getItem('CartIteam'))[i];
      if (i != removevl) {
        this.cartitem.push(val);
      }
    }
    localStorage.removeItem('CartIteam');
    localStorage.setItem('CartIteam', JSON.stringify(this.cartitem));
    if (JSON.parse(localStorage.getItem('CartIteam')).length > 0) {
      this.getdata();
      this.nodata = false;
    } else {
      this.nodata = true;
    }

  }



  getdata() {
    this.finalarray = [];
    var total = 0;
    for (let index = 0; index < this.cartitem.length; index++) {
      var flag = this.cartitem[index].ArticleData[0].ArticleOpenFlag;
      let body;
      if (flag == 0) {
        this.newcartitem = this.cartitem[index];
        this.size = JSON.parse(this.cartitem[index].ArticleData[0].ArticleSize);
        this.color = JSON.parse(this.cartitem[index].ArticleData[0].ArticleColor);
        for (let j = 0; j < this.size.length; j++) {
          this.newsize = this.newsize + this.size[j].Name + ",";
        }
        var sizestr = this.newsize.substring(0, this.newsize.length - 1);

        for (let j = 0; j < this.color.length; j++) {
          this.newcolor = this.newcolor + this.color[j].Name + ",";
        }
        var colorstr = this.newcolor.substring(0, this.newcolor.length - 1);

        //Sum Of Rate

        total = Number(total) + Number(this.cartitem[index].Amount);
        this.Total = total;
        this.newsize = "";
        this.newcolor = "";
        var ia = ""
        if (this.cartitem[index].ArticleData[0].Images != "" && this.cartitem[index].ArticleData[0].Images != null) {
          var str = this.cartitem[index].ArticleData[0].Images;
          var str_array = str.split(',');
          for (var i = 0; i < str_array.length; i++) {
            // Trim the excess whitespace.
            str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
            ia = this.uploadURL + str_array[0];
          }
        } else {
          ia = 'assets/img/no-image-available.png'
        }

        //alert(this.cartitem[index].RequiredNoPacks);
        body = {
          "Id": this.cartitem[index].ArticleData[0].Id,
          "ArticleNumber": this.cartitem[index].ArticleData[0].ArticleNumber,
          "ArticleRate": this.cartitem[index].Amount,
          "ArticleRatio": this.cartitem[index].ArticleData[0].ArticleRatio,
          "ArticleSize": sizestr,
          "ArticleColor": colorstr,
          "Images": ia,
          "Title": this.cartitem[index].ArticleData[0].Title,
          "SalesNoPacks": this.cartitem[index].ArticleData[0].SalesNoPacks,
          "RequiredNoPacks": this.cartitem[index].RequiredNoPacks,
          "Total": total
        }
      } else {
        //Sum Of Rate
        total = Number(total) + Number(this.cartitem[index].Amount);
        this.Total = total;
        body = {
          "Id": this.cartitem[index].ArticleData[0].Id,
          "ArticleNumber": this.cartitem[index].ArticleData[0].ArticleNumber,
          "ArticleOpenFlag": flag,
          "Images": 'assets/img/no-image-available.png',
          "ArticleRate": this.cartitem[index].Amount,
          "NoPacks": this.cartitem[index].ArticleData[0].NoPacks,
          "RequiredNoPacks": this.cartitem[index].RequiredNoPacks,
          "Total": total
        }

      }

      this.finalarray.push(body)


    }

  }

  docartform() {
    setTimeout(() => this.spinner.show(), 25);
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    this.soFrontForm.value.GSTType = this.GSTType;
    let body1 = JSON.stringify({
      "ArticleData": this.cartitem,
      "Carddata": this.soFrontForm.value,
      "UserId": userdata[0].Id
    });

    this.userService.cartplaceorder(body1).subscribe((res) => {

      if (res['SONO'] != "" && res['Result'] == "SUCCESS") {
        this.soID = res['SONO'];
        this.nodata = true;
        this.thanks = true;
        this.pdficon = true;
        this.success(res);
      }else{
        this.success(res);
        this.spinner.hide();
      }

    });
  ;
  }

  pdfdownload() {
    this.router.navigate(['sochallan', { SONO: this.soID, Back: "4" }])
  }

  success(data) {
 
    if (data.id != "") {
      localStorage.setItem('Cartavailable', "1");
      let cartavi = localStorage.getItem('Cartavailable');
      localStorage.removeItem('CartIteam');
      this.getdata();
      this.toastr.success('Success', 'Sales Order Successfully');

    } else if (data.NoOfSetNotMatch == "true") {
      this.toastr.error('Failed', data.ArticleNumber + ' Out of stock');
    } else if (data.ZeroNotAllow == "true") {
      this.toastr.error('Failed', 'Zero value not allow for "no of pieces"');
    } else {
      this.toastr.error('Failed', 'Please try agin later');
    }
    this.spinner.hide();
  }

}
