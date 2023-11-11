import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { LoginComponent } from '../../views/login/login.component';
import { UserService } from '../../services/user.service';
import { exit } from 'process';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FormControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  // selector: 'app-header',
  templateUrl: './default-layout.component.html'
})


export class DefaultLayoutComponent implements OnDestroy {

  public userlist: any = [];
  public navItems = navItems;

  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  username: any;
  blankdash: any = [];
  dashboardNewVL: Number = 0;
  articlesearch: any;
  partialarticles: any = [];
  partialoutletarticles:any =[];
  searchcondition: boolean = false;
  articleSearchForm: FormGroup;
  outletArticleSearchForm:FormGroup;
  ArticleId: any = [];
  OutletArticleId:any =[];
  currentYear: number=new Date().getFullYear();

  constructor(private formBuilder: FormBuilder, public router: Router, private userService: UserService, @Inject(DOCUMENT) _document?: any) {

    this.articleSearchForm = this.formBuilder.group({
      ArticleId: [''],
    });
    this.outletArticleSearchForm = this.formBuilder.group({
      OutletArticleId: [''],
    });
    this.userService.getpartialarticle().subscribe((data) => {
      if (data['status'] === 'SUCCESS') {
        this.partialarticles = data['articles'];
      }
    })
    this.userService.getpartialoutletarticle().subscribe((data) => {
        this.partialoutletarticles = data;
    })

    let item = JSON.parse(localStorage.getItem('logindata'));
    let userdata = JSON.parse(localStorage.getItem('logindata'));
    this.username = userdata[0].Name;
    var rights = {};
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      rights = rolerights;

      var Count1 = Object.keys(rolerights).length;

      var Count = Object.keys(rights).length;
      var Dashboard_Rules = {};
      var User_Managment_Rules = {};
      var Assign_Rights_Rules = {};
      var Article_Color_Rules = {};
      var Article_Size_Rules = {};
      var Article_Ratio_Rules = {};
      var Category_Rules = {};
      var SubCategory_Rules = {};
      var RangeSeries_Rules = {};
      var Inward_Rules = {};
      var Outward_Rules = {};
      var Rack_Rules = {};
      var Userrole_Rules = {};
      var Article_Launch_Rules ={};
      var SO_Rules = {};
      var Sofrontview_Rules = {};
      var PO_Rules = {};
      var Reports_Rules = {};
      var MasterLabel_Rules = {};
      var Article_Rules = {};
      var Vendor_Rules = {};
      var Party_Rules = {};
      var Brand_Rules = {};
       //adding aditional code
      var Article_Photos_Rules = {};
      var WorkorderStatus_Rules = {};
      var Outlet_Rules = {};

      var ArticleRate_Rules = {};
      var SOStatus_Rules = {};
      var OutletSalesReturn_Rules = {};
      var SalesReturn_Rules = {};
      var PurchaseReturn_Rules = {};
      var Return_Rules = {};
      var FinancialYear_Rules = {};
      var ArticlePublish_Rules = {};

      var StockTransfer_Rules = {};
      var ImportCsv_Rules = {};

      var Rection_Rules ={};
      var Transportation_Rules = {};
      var Beaner_Rules = {};
      var Bug_Rules ={};
      var Article_Launch_Edit_Rules ={};
      for (let i = 0; i <= 49; i++) {
        if (rights[i] === undefined) {
          continue;
        } else {

          var getPageId = rights[i].PageId;
          // console.log('page', getPageId)
          if (rights[i].ListRights == 1) {

            if (1 == getPageId) {
              User_Managment_Rules = {
                name: 'User Managment',
                url: '/userlist',
                icon: 'icon-user',
                // attributes: { disabled: true },
                // id:1
              }
            }
            if (2 == getPageId) {
              Assign_Rights_Rules = {
                name: 'Assign Rights',
                url: '/accessrights',
                icon: 'icon-user-following',
              }
            }
            if (3 == getPageId) {
              Inward_Rules = {
                name: 'Inward',
                url: '/inwardlist',
                icon: 'fa fa-compress'
              }
            }
            if (4 == getPageId) {
              Outward_Rules = {
                name: 'Outward',
                url: '/outwardlist',
                icon: 'icon-social-dropbox'
              }
            }

            // if (39 == getPageId) {
            //   Article_Launch_Rules = {
            //     name: 'Article Launch',
            //     url: '/articlelaunchlist',
            //     icon: 'fa fa-rocket'
            //   }
            // }

            if (5 == getPageId) {
              SO_Rules = {
                name: 'SO',
                url: '/solist',
                icon: 'fa fa-cart-arrow-down'
              }
            }
            if (5 == getPageId) {
              Sofrontview_Rules = {
                name: 'So Front View',
                url: '/socategorylist',
                icon: 'fa fa-cart-arrow-down',
              }

            }

            if (6 == getPageId) {
              PO_Rules = {
                name: 'PO',
                url: '/polist',
                icon: 'fa fa-cart-plus'
              }
            }
            // if (40 == getPageId) {
            //   PO_Rules = {
            //     name: 'Article Launch',
            //     url: '/articlelaunch',
            //     icon: 'fa fa-file-text'
            //   }
            // }
            if (33 == getPageId) {
              Article_Rules = {
                name: 'Article',
                url: '/articlelist',
                icon: 'fa fa-file-text'
              }
            }

        // if (39 == getPageId) {
        //       Article_Launch_Rules = {
        //         name: 'Article Launch',
        //         url: '/articlelaunchlist',
        //         icon: 'icon-layers'
        //       }
        // }
            
        if (18 == getPageId) {
              Article_Photos_Rules = {
                name: 'Article Photos',
                url: '/articlephotoslist',
                icon: 'icon-tag'
              }
            }
            if (7 == getPageId) {
              Reports_Rules = {
                name: 'Reports',
                url: '/reportcategory',
                icon: 'fa fa-file-text'
              }
            }
            // if(8==getPageId){
            //   Master_Rules = {
            //     name: 'PO',
            //     url: '/po',
            //     icon: 'icon-pencil'
            //   }
            // }
            if (9 == getPageId) {
              Category_Rules = {
                name: 'Category',
                url: '/categorylist',
                icon: 'icon-book-open'
              }
            }

            if (29 == getPageId) {
              SubCategory_Rules = {
                name: 'Subcategory',
                url: '/subcategorylist',
                icon: 'icon-book-open'
              }
            }

            if (30 == getPageId) {
              ImportCsv_Rules = {
                name: 'ImportCSV',
                url: '/importcsv',
                icon: 'fa fa-file'
              }
            }

            if (32 == getPageId) {
              RangeSeries_Rules = {
                name: 'RangeSeries',
                url: '/rangeserieslist',
                icon: 'fa fa-file'
              }
            }

            if (11 == getPageId) {
              Article_Color_Rules = {
                name: 'Article Color',
                url: '/articlecolorlist',
                icon: 'fa fa-paint-brush'
              }
            }
            if (12 == getPageId) {
              Article_Size_Rules = {
                name: 'Article Size',
                url: '/sizelist',
                icon: 'icon-frame'
              }
            }
            if (13 == getPageId) {
              Article_Ratio_Rules = {
                name: 'Article Ratio',
                url: '/ratiolist',
                icon: 'icon-pie-chart'
              }
            }
            if (14 == getPageId) {
              Vendor_Rules = {
                name: 'Vendor',
                url: '/vendorlist',
                icon: 'cui-people'
              }
            }
            if (15 == getPageId) {
              Brand_Rules = {
                name: 'Brand',
                url: '/brandlist',
                icon: 'icon-tag'
              }
            }
            //adding aditional code
            if (38 == getPageId) {
            Transportation_Rules = {
              name: 'Transportation',
              url: '/transportationlist',
              icon: 'cui-people'
            }
          }

           //adding aditional code
           if (38 == getPageId) {
            Transportation_Rules = {
              name: 'Beaner',
              url: '/beanerlist',
              icon: 'cui-people'
            }
          }
          

            if (17 == getPageId) {
              Party_Rules = {
                name: 'Party Master',
                url: '/partylist',
                icon: 'cui-people'
              }
            }
            if (16 == getPageId) {
              Rack_Rules = {
                name: 'Rack',
                url: '/racklist',
                icon: 'icon-layers'
              }
            }
            if (37 == getPageId) {
              Rection_Rules = {
                name: 'Rejection',
                url: '/rejectionlist',
                icon: 'icon-layers'
              }
            }
            if (38 == getPageId) {
              Bug_Rules = {
                name: 'Debug ',
                url: '/debug',
                icon: 'icon-layers'
              }
            }



            // if (35 == getPageId) {
              Userrole_Rules = {
                name: 'User Role',
                url: '/userrolelist',
                icon: 'icon-layers'
              }
            // }
            if (19 == getPageId) {
              this.dashboardNewVL = 1;
              Dashboard_Rules = {
                name: 'Dashboard',
                url: '/dashboard',
                icon: 'icon-speedometer'
              }
            }
            if (20 == getPageId) {
              WorkorderStatus_Rules = {
                name: 'Work Order Status',
                url: '/workorderlist',
                icon: 'icon-speedometer'
              }
            }
            if (21 == getPageId) {
              Outlet_Rules = {
                name: 'Outlet Management',
                //url: '/buttons',
                icon: 'icon-speedometer',
                children: [
                  {
                    name: 'Outlet',
                    url: '/outletlist',
                    //icon: 'icon-cursor'
                  },
                  {
                    name: 'In-Transit',
                    url: '/outletransport',
                    //icon: 'icon-cursor'
                  }
                ]
              }
            }
            if (23 == getPageId) {
              SOStatus_Rules = {
                name: 'SO Status',
                url: '/sostatuslist',
                icon: 'fa fa-list-alt',
              }
            }
            if (36 == getPageId) {
              OutletSalesReturn_Rules = {
                name: 'Outlet Sales Return',
                url: '/outletsalesreturnlist',
                //icon: 'icon-cursor'
              }
            }
            if (24 == getPageId) {
              SalesReturn_Rules = {
                name: 'Sales Return',
                url: '/salesreturnlist',
                //icon: 'icon-cursor'
              }
            }
            if (25 == getPageId) {
              PurchaseReturn_Rules = {
                name: 'Purchase Return',
                url: '/purchasereturnlist',
                //icon: 'icon-cursor'
              }
            }
            if (27 == getPageId) {
              FinancialYear_Rules = {
                name: 'Financial Year',
                url: '/financialyearlist',
                icon: 'fa fa-money'
              }
            }
            if (34 == getPageId) {
              StockTransfer_Rules = {
                name: 'Stock Transfer',
                url: '/stocktransferlist',
                icon: 'fa fa-exchange'
              }
            }
          } else {

            if (rights[i].PageId == 28 && rights[i].AddRights == 1) {
              ArticlePublish_Rules = {
                name: 'Quality Management',
                //url: '/buttons',
                icon: 'fa fa-file-image-o',
                children: [
                  {
                    name: 'Approve Article',
                    url: '/approvearticlelist',
                    //icon: 'icon-cursor'
                  },
                  {
                    name: 'Hold Article',
                    url: '/holdarticlelist',
                    //icon: 'icon-cursor'
                  },
                  {
                    name: 'Rejected Article',
                    url: '/rejectedarticlelist',
                    //icon: 'icon-cursor'
                  },  
                ]
              }
              
            }
            // if (rights[i].PageId == 39 && rights[i].AddRights == 1) {
            //   Article_Launch_Rules = {
            //     name: 'Article Launch',
            //     url: '/articlelaunchlist',
            //     icon: 'fa fa-rocket'
            //   }
            // }

            // if(rights[i].PageId==28 && rights[i].AddRights==1){
            //   ArticlePublish_Rules = {
            //       name: 'Quality Management',
            //       url: '/productlounch',
            //       icon: 'fa fa-file-image-o'
            //     }
            // }


            if (rights[i].ListRights == 0 && rights[i].PageId == 22) {
              ArticleRate_Rules = {
                name: 'Launch Module',
                // url: '/articleratechange',
                icon: 'fa fa-inr',
                children: [
                  {
                    name: 'Article Rate Change',
                    url: '/articleratechange',
                  },
                  {
                    name: 'Article Launch',
                    url: '/articlelaunchlist',
                  }                  
                ]
              }
            }

            if (rights[i].ListRights == 0 && rights[i].PageId == 19) {
              this.dashboardNewVL = 0;
            }

            //this.dashboardNewVL = 1;
          }

          continue;
        }
      }

      if (this.dashboardNewVL == 1) {
        this.blankdash = ['/dashboard'];
      } else {
        this.blankdash = ['/newdashboard'];
      }
      var Dashboard_Rules_Count = Object.keys(Dashboard_Rules).length;
      var Category_Rules_Count = Object.keys(Category_Rules).length;
      var SubCategory_Rules_Count = Object.keys(SubCategory_Rules).length;
      // var Article_Launch_Rules_Count = Object.keys(Article_Launch_Rules).length;

      var ImportCsv_Rules_Count = Object.keys(ImportCsv_Rules).length;
      var Article_Rules_Count = Object.keys(Article_Rules).length;
      var Article_Color_Rules_Count = Object.keys(Article_Color_Rules).length;
      var Article_Size_Rules_Count = Object.keys(Article_Size_Rules).length;
      var Article_Ratio_Rules_Count = Object.keys(Article_Ratio_Rules).length;
      var Vendor_Rules_Count = Object.keys(Vendor_Rules).length;
      var Party_Rules_Count = Object.keys(Party_Rules).length;
      var Brand_Rules_Count = Object.keys(Brand_Rules).length;
       //adding aditional code
      var Rack_Rules_Count = Object.keys(Rack_Rules).length;
      var Userrole_Rules_Count = Object.keys(Userrole_Rules).length;
      var OutletSalesReturn_Rules_Count = Object.keys(OutletSalesReturn_Rules).length;
      var SalesReturn_Rules_Count = Object.keys(SalesReturn_Rules).length;
      var PurchaseReturn_Rules_Count = Object.keys(PurchaseReturn_Rules).length;
      var FinancialYear_Rules_Count = Object.keys(FinancialYear_Rules).length;
      var ArticlePublish_Rules_Count = Object.keys(ArticlePublish_Rules).length;
      var Rection_Rules_Count = Object.keys(Rection_Rules).length;
      var Transportation_Rules_Count = Object.keys( Transportation_Rules).length;
      var Beaner_Rules_Count = Object.keys( Beaner_Rules).length;
      var Bug_Rules_Count = Object.keys(Bug_Rules).length;
      var Article_Launch_Edit_Rules_Count =Object.keys(Article_Launch_Edit_Rules).length;


      if (Category_Rules_Count > 0 || Article_Launch_Edit_Rules_Count > 0 || ImportCsv_Rules_Count > 0 || SubCategory_Rules_Count > 0 || Article_Rules_Count > 0 || Transportation_Rules_Count>0 || Beaner_Rules_Count>0 || Article_Color_Rules_Count > 0 || Article_Size_Rules_Count > 0 || Article_Ratio_Rules_Count > 0 || Vendor_Rules_Count > 0 || Party_Rules_Count > 0 || Brand_Rules_Count > 0 || Rack_Rules_Count > 0 || Userrole_Rules_Count > 0 || Rection_Rules_Count > 0 || Bug_Rules_Count > 0  ) {
        MasterLabel_Rules = {
          title: true,
          name: 'Master '
        }
      }

      if (SalesReturn_Rules_Count > 0 || PurchaseReturn_Rules_Count > 0 || OutletSalesReturn_Rules_Count > 0) {
        {
          Return_Rules = {
            name: 'Returns',
            //url: '/buttons',
            icon: 'fa fa-rotate-left',
            children: [
              SalesReturn_Rules,
              PurchaseReturn_Rules,
              OutletSalesReturn_Rules
            ]
          }

        }
      }

      const person = [
        Dashboard_Rules,
        User_Managment_Rules,
        Assign_Rights_Rules,
        Article_Rules,
        PO_Rules,
        Inward_Rules,
        ArticlePublish_Rules,
        Article_Launch_Rules,
        SO_Rules,
        Sofrontview_Rules,
        Outward_Rules,
        //adding aditional code
        SOStatus_Rules,
        ArticleRate_Rules,
        Return_Rules,
        Article_Photos_Rules,
        Reports_Rules,
        Outlet_Rules,
        StockTransfer_Rules,
        MasterLabel_Rules,
        ImportCsv_Rules,
        Category_Rules,
        SubCategory_Rules,
        RangeSeries_Rules,
        WorkorderStatus_Rules,
        Article_Color_Rules,
        Article_Size_Rules,
        //Article_Ratio_Rules,
        Transportation_Rules,
        Beaner_Rules,
        Vendor_Rules,
        Brand_Rules,
        Party_Rules,
        Rack_Rules,
        Userrole_Rules,
        FinancialYear_Rules,
        Rection_Rules,
        Bug_Rules,
        Article_Launch_Edit_Rules
      ];

      this.navItems = person;
      //});


      this.changes = new MutationObserver((mutations) => {
        this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
      });
      this.element = _document.body;
      this.changes.observe(<Element>this.element, {
        attributes: true,
        attributeFilter: ['class']
      });
    } else {
      this.userService.getroleRightssidebar(item[0].Role).subscribe((data) => {
        localStorage.setItem('roleright', JSON.stringify(data));
        rights = data
        var Count = Object.keys(data).length;

        var Count = Object.keys(rights).length;
        var Dashboard_Rules = {};
        var User_Managment_Rules = {};
        var Assign_Rights_Rules = {};
        var Article_Color_Rules = {};
        var Article_Size_Rules = {};
        var Article_Ratio_Rules = {};
        var Category_Rules = {};
        var SubCategory_Rules = {};
        var RangeSeries_Rules = {};
         //adding aditional code
         
        //var Article_Rules = {};
        var Inward_Rules = {};
        var Outward_Rules = {};
        var Rack_Rules = {};
        var Userrole_Rules = {};
        var Article_Launch_Rules ={};
        var SO_Rules = {};
        var Sofrontview_Rules = {};
        var PO_Rules = {};
        var Reports_Rules = {};
        var MasterLabel_Rules = {};
        var Article_Rules = {};
        var Vendor_Rules = {};
        var Party_Rules = {};
        var Brand_Rules = {};
        var Article_Photos_Rules = {};
        var WorkorderStatus_Rules = {};
        var Outlet_Rules = {};

        var ArticleRate_Rules = {};
        var SOStatus_Rules = {};
        var OutletSalesReturn_Rules = {};
        var SalesReturn_Rules = {};
        var PurchaseReturn_Rules = {};
        var FinancialYear_Rules = {};
        var Return_Rules = {};
        var ArticlePublish_Rules = {};

        var ImportCsv_Rules = {};
        var StockTransfer_Rules = {};
        var Rection_Rules ={};
        var  Transportation_Rules = {};
        var  Baner_Rules = {};
        var Bug_Rules ={};
        var Article_Launch_Edit_Rules = {};

        for (let i = 0; i <= 49; i++) {
          if (rights[i] === undefined) {
            continue;
          } else {
            var getPageId = rights[i].PageId;
            if (rights[i].ListRights == 1) {


              if (1 == getPageId) {
                User_Managment_Rules = {
                  name: 'User Managment',
                  url: '/userlist',
                  icon: 'icon-user',
                  // attributes: { disabled: true },
                  // id:1
                }
              }
              if (2 == getPageId) {
                Assign_Rights_Rules = {
                  name: 'Assign Rights',
                  url: '/accessrights',
                  icon: 'icon-user-following',
                }
              }
              if (3 == getPageId) {
                Inward_Rules = {
                  name: 'Inward',
                  url: '/inwardlist',
                  icon: 'fa fa-compress'
                }
              }
              if (4 == getPageId) {
                Outward_Rules = {
                  name: 'Outward',
                  url: '/outwardlist',
                  icon: 'icon-social-dropbox'
                }
              }


              // if (39 == getPageId) {
              //   Article_Launch_Rules = {
              //     name: 'Article Launch',
              //     url: '/articlelaunchlist',
              //     icon: 'fa fa-rocket'
              //   }
              // }


              if (5 == getPageId) {
                SO_Rules = {
                  name: 'SO',
                  url: '/solist',
                  icon: 'fa fa-cart-arrow-down'
                }
              }
              if (5 == getPageId) {
                Sofrontview_Rules = {
                  name: 'So Front View',
                  url: '/socategorylist',
                  icon: 'fa fa-cart-arrow-down',
                }

              }

              if (6 == getPageId) {
                PO_Rules = {
                  name: 'PO',
                  url: '/polist',
                  icon: 'fa fa-cart-plus'
                }
              }
              if (33 == getPageId) {
                Article_Rules = {
                  name: 'Article',
                  url: '/articlelist',
                  icon: 'fa fa-file-text'
                }
              }

          // if (39 == getPageId) {
          //       Article_Launch_Rules = {
          //         name: 'Article Launch',
          //         url: '/articlelaunchlist',
          //         icon: 'icon-layers'
          //     }
          // }

              if (18 == getPageId) {
                Article_Photos_Rules = {
                  name: 'Article Photos',
                  url: '/articlephotoslist',
                  icon: 'icon-tag'
                }
              }
              if (7 == getPageId) {
                Reports_Rules = {
                  name: 'Reports',
                  url: '/reportcategory',
                  icon: 'fa fa-file-text'
                }
              }
              // if(8==getPageId){
              //   Master_Rules = {
              //     name: 'PO',
              //     url: '/po',
              //     icon: 'icon-pencil'
              //   }
              // }
              if (9 == getPageId) {
                Category_Rules = {
                  name: 'Category',
                  url: '/categorylist',
                  icon: 'icon-book-open'
                }
              }

              if (29 == getPageId) {
                SubCategory_Rules = {
                  name: 'Subcategory',
                  url: '/subcategorylist',
                  icon: 'icon-book-open'
                }
              }



              if (30 == getPageId) {
                ImportCsv_Rules = {
                  name: 'ImportCSV',
                  url: '/importcsv',
                  icon: 'fa fa-file'
                }
              }

              if (32 == getPageId) {
                RangeSeries_Rules = {
                  name: 'RangeSeries',
                  url: '/rangeserieslist',
                  icon: 'fa fa-file'
                }
              }


              if (11 == getPageId) {
                Article_Color_Rules = {
                  name: 'Article Color',
                  url: '/articlecolorlist',
                  icon: 'fa fa-paint-brush'
                }
              }
              if (12 == getPageId) {
                Article_Size_Rules = {
                  name: 'Article Size',
                  url: '/sizelist',
                  icon: 'icon-frame'
                }
              }
              if (13 == getPageId) {
                Article_Ratio_Rules = {
                  name: 'Article Ratio',
                  url: '/ratiolist',
                  icon: 'icon-pie-chart'
                }
              }
              if (14 == getPageId) {
                Vendor_Rules = {
                  name: 'Vendor',
                  url: '/vendorlist',
                  icon: 'cui-people'
                }
              }
              if (15 == getPageId) {
                Brand_Rules = {
                  name: 'Brand',
                  url: '/brandlist',
                  icon: 'icon-tag'
                }
              }
                //adding aditional code
         
              if (17 == getPageId) {
                Party_Rules = {
                  name: 'Party Master',
                  url: '/partylist',
                  icon: 'cui-people'
                }
              }
              if (16 == getPageId) {
                Rack_Rules = {
                  name: 'Rack',
                  url: '/racklist',
                  icon: 'icon-layers'
                }
              }
              if (37 == getPageId) {
                Rection_Rules = {
                  name: 'Rejection',
                  url: '/rejectionlist',
                  icon: 'icon-layers'
                }
              }
              if (38 == getPageId) {
                Bug_Rules = {
                  name: 'Debug',
                  url: '/debug',
                  icon: 'icon-layers'
                }
              }

              // if (39 == getPageId) {
              //   Article_Launch_Rules = {
              //     name: 'Article Launch',
              //     url: '/articlelaunchlist',
              //     icon: 'icon-layers'
              //   }
              // }

              // if (40 == getPageId) {
              //   Article_Launch_Edit_Rules = {
              //     name: 'Article Launch Edit',
              //     url: '/articlelaunchedit',
              //     icon: 'icon-layers'
              //   }
              // }

              if (35 == getPageId) {
                Userrole_Rules = {
                  name: 'User Role',
                  url: '/userrolelist',
                  icon: 'icon-layers'
                }
              }
              if (19 == getPageId) {
                this.dashboardNewVL = 1;
                Dashboard_Rules = {
                  name: 'Dashboard',
                  url: '/dashboard',
                  icon: 'icon-speedometer'
                }
              }
              if (20 == getPageId) {
                WorkorderStatus_Rules = {
                  name: 'Work Order Status',
                  url: '/workorderlist',
                  icon: 'icon-speedometer'
                }
              }
              if (21 == getPageId) {
                Outlet_Rules = {
                  name: 'Outlet Management',
                  //url: '/buttons',
                  icon: 'icon-speedometer',
                  children: [
                    {
                      name: 'Outlet',
                      url: '/outletlist',
                      //icon: 'icon-cursor'
                    },
                    {
                      name: 'In-Transit',
                      url: '/outletransport',
                      //icon: 'icon-cursor'
                    }
                  ]
                }
              }
              if (23 == getPageId) {
                SOStatus_Rules = {
                  name: 'SO Status',
                  url: '/sostatuslist',
                  icon: 'fa fa-list-alt',
                }
              }
              if (36 == getPageId) {
                OutletSalesReturn_Rules = {
                  name: 'Outlet Sales Return',
                  url: '/outletsalesreturnlist',
                  //icon: 'icon-cursor'
                }
              }
              if (24 == getPageId) {
                SalesReturn_Rules = {
                  name: 'Sales Return',
                  url: '/salesreturnlist',
                  //icon: 'icon-cursor'
                }
              }
              if (25 == getPageId) {
                PurchaseReturn_Rules = {
                  name: 'Purchase Return',
                  url: '/purchasereturnlist',
                  //icon: 'icon-cursor'
                }
              }
              if (27 == getPageId) {
                FinancialYear_Rules = {
                  name: 'Financial Year',
                  url: '/financialyearlist',
                  icon: 'fa fa-money'
                }
              }
              if (34 == getPageId) {
                StockTransfer_Rules = {
                  name: 'Stock Transfer',
                  url: '/stocktransferlist',
                  icon: 'fa fa-exchange'
                }
              }

            } else {
              if (rights[i].ListRights == 0 && rights[i].PageId == 19) {
                this.dashboardNewVL = 0;
              }

              if (rights[i].ListRights == 0 && rights[i].PageId == 22) {
                ArticleRate_Rules = {
                  name: 'Launch Module',
                  // url: '/articleratechange',
                  icon: 'fa fa-inr',
                  children: [
                    {
                      name: 'Article Rate Change',
                      url: '/articleratechange',
                    },
                    {
                      name: 'Article Launch',
                      url: '/articlelaunchlist',
                    }                  
                  ]
                }
              }

              if (rights[i].PageId == 28 && rights[i].AddRights == 1) {
                {
                  ArticlePublish_Rules = {
                    name: 'Quality Management',
                    //url: '/buttons',
                    icon: 'fa fa-file-image-o',
                    children: [
                      {
                        name: 'Approve Article',
                        url: '/approvearticlelist',
                        //icon: 'icon-cursor'
                      },
                      {
                        name: 'Hold Article',
                        url: '/holdarticlelist',
                        //icon: 'icon-cursor'
                      },
                      {
                        name: 'Rejected Article',
                        url: '/rejectedarticlelist',
                        //icon: 'icon-cursor'
                      },
                    ]
                  }
                }

                // if (rights[i].PageId == 39 && rights[i].AddRights == 1) {
                //   Article_Launch_Rules = {
                //     name: 'Article Launch',
                //     url: '/articlelaunchlist',
                //     icon: 'fa fa-rocket'
                //   }
                // }
                // ArticlePublish_Rules = {
                //     name: 'Quality Management',
                //     url: '/productlounch',
                //     icon: 'fa fa-file-image-o'
                //   }
              }

            }

            continue;
          }
        }

        if (this.dashboardNewVL == 1) {
          this.blankdash = ['/dashboard'];
        } else {
          this.blankdash = ['/newdashboard'];
        }

        var Dashboard_Rules_Count = Object.keys(Dashboard_Rules).length;
        // var Article_Launch_Rules_Count = Object.keys(Article_Launch_Rules).length;
        var Category_Rules_Count = Object.keys(Category_Rules).length;
        var SubCategory_Rules_Count = Object.keys(SubCategory_Rules).length;
        var ImportCsv_Rules_Count = Object.keys(ImportCsv_Rules).length;
        var Article_Rules_Count = Object.keys(Article_Rules).length;
        var Article_Color_Rules_Count = Object.keys(Article_Color_Rules).length;
        var Article_Size_Rules_Count = Object.keys(Article_Size_Rules).length;
        var Article_Ratio_Rules_Count = Object.keys(Article_Ratio_Rules).length;
        var Vendor_Rules_Count = Object.keys(Vendor_Rules).length;
        var Party_Rules_Count = Object.keys(Party_Rules).length;
        var Brand_Rules_Count = Object.keys(Brand_Rules).length;
        var Rack_Rules_Count = Object.keys(Rack_Rules).length;
        var Userrole_Rules_Count = Object.keys(Userrole_Rules).length;
        //adding aditional code
        var OutletSalesReturn_Rules_Count = Object.keys(OutletSalesReturn_Rules).length;
        var SalesReturn_Rules_Count = Object.keys(SalesReturn_Rules).length;
        var PurchaseReturn_Rules_Count = Object.keys(PurchaseReturn_Rules).length;
        var FinancialYear_Rules_Count = Object.keys(FinancialYear_Rules).length;
        var ArticlePublish_Rules_Count = Object.keys(ArticlePublish_Rules).length;
        var Rection_Rules_Count = Object.keys(Rection_Rules).length;
        var  Transportation_Rules_Count = Object.keys( Transportation_Rules).length;
        var  Beaner_Rules_Count = Object.keys( Beaner_Rules).length;
        var Bug_Rules_Count = Object.keys(Rection_Rules).length;
        var Article_Launch_Edit_Rules_Count = Object.keys(Article_Launch_Edit_Rules).length;

        if (Category_Rules_Count > 0 || ImportCsv_Rules_Count > 0 || SubCategory_Rules_Count > 0 || Article_Launch_Edit_Rules_Count > 0 || Article_Rules_Count > 0 || Transportation_Rules_Count > 0|| Article_Color_Rules_Count > 0 || Article_Size_Rules_Count > 0 || Article_Ratio_Rules_Count > 0 || Vendor_Rules_Count > 0 || Party_Rules_Count > 0 || Brand_Rules_Count > 0 || Rack_Rules_Count > 0 || Userrole_Rules_Count > 0 || Rection_Rules_Count > 0 || Bug_Rules_Count > 0 ) {
          MasterLabel_Rules = {
            title: true,
            name: 'Master '
          }
        }

        if (SalesReturn_Rules_Count > 0 || PurchaseReturn_Rules_Count > 0 || OutletSalesReturn_Rules_Count > 0) {
          {
            Return_Rules = {
              name: 'Returns',
              //url: '/buttons',
              icon: 'fa fa-rotate-left',
              children: [
                SalesReturn_Rules,
                PurchaseReturn_Rules,
                OutletSalesReturn_Rules
              ]
            }

          }
        }

        const person = [
          Dashboard_Rules,
          User_Managment_Rules,
          Assign_Rights_Rules,
          Article_Rules,
          PO_Rules,
          Inward_Rules,
          ArticlePublish_Rules,
          Article_Launch_Rules,
           //adding aditional code
          SO_Rules,
          Sofrontview_Rules,
          Outward_Rules,
          SOStatus_Rules,
          ArticleRate_Rules,
          Return_Rules,
          Article_Photos_Rules,
          Reports_Rules,
          Outlet_Rules,
          StockTransfer_Rules,
          MasterLabel_Rules,
          ImportCsv_Rules,
          Category_Rules,
          SubCategory_Rules,
          RangeSeries_Rules,
          WorkorderStatus_Rules,
          Article_Color_Rules,
          Article_Size_Rules,
          //Article_Ratio_Rules,
          Transportation_Rules,
          Baner_Rules,
          Vendor_Rules,
          Brand_Rules,
          Party_Rules,
          Rack_Rules,
          Userrole_Rules,
          FinancialYear_Rules,
          Rection_Rules,
          Bug_Rules,
          Article_Launch_Edit_Rules

          ];

        this.navItems = person;
        //});


        this.changes = new MutationObserver((mutations) => {
          this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
        });
        this.element = _document.body;
        this.changes.observe(<Element>this.element, {
          attributes: true,
          attributeFilter: ['class']
        });
      });
    }

    this.pagerightscheck();

  }

  pagerightscheck() {
    let item = JSON.parse(localStorage.getItem('userdata'));
    let rolerights = JSON.parse(localStorage.getItem('roleright'));
    if (rolerights != "" && rolerights != null && rolerights != undefined) {
      this.rightscheck(rolerights, 1);
    } else {
      this.userService.getroleRights(item[0].Role).subscribe((res) => {
        this.rightscheck(res, 2);
      });
    }
  }

  rightscheck(data, no) {
    let item = JSON.parse(localStorage.getItem('userdata'));
    if (no == 1) {
      var Count = Object.keys(data).length;
      for (let i = 0; i < Count; i++) {
        if (data[i].PageId == 31) {
          if (data[i].ListRights == 1) {
            this.searchcondition = true;
            return;
          } else {
            this.searchcondition = false;
          }
        } else {
          this.searchcondition = false;
        }

      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageId == 31) {
          if (data[i].ListRights == 1) {
            this.searchcondition = true;
            return;
          } else {
            this.searchcondition = false;
          }
        } else {
          this.searchcondition = false;
        }

      }

    }
  }

  ngOnDestroy(): void {
    localStorage.clear();
    this.changes.disconnect();
  }

  getval() {
    console.log(this.ArticleId);
    // this.router.navigate(['articlesearch', { article: val }]);
    this.router.navigate(['/articlesearch'], { queryParams: { article: encodeURIComponent(this.ArticleId.ArticleNumber) } });
    this.articlesearch = '';
    $('input:text').val("");
  }
  getoutletval(){
    console.log(this.OutletArticleId);
    this.router.navigate(['/outletarticlesearch'], { queryParams: { article: encodeURIComponent(this.OutletArticleId.ArticleNumber) } });
    this.articlesearch = '';
    $('input:text').val("");
  }

  dashboard() {
  }



  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
