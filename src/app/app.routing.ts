import { ArticlephotosComponent } from './views/articlephotos/articlephotos.component';
import { ArticleimgslistComponent } from './views/articleimgslist/articleimgslist.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { UsersComponent } from './views/users/users.component';
import{ DashboardComponent } from './views/dashboard/dashboard.component';
import { InwardComponent } from './views/inward/inward.component';
import { OutwardComponent } from './views/outward/outward.component';
import{ArticlelauncheditComponent} from './views/articlelaunchedit/articlelaunchedit.component';
import { SoComponent } from './views/so/so.component';
import { PoComponent } from './views/po/po.component';
import { VendorComponent } from './views/vendor/vendor.component';
import { CategoryComponent } from './views/category/category.component';
import { BrandComponent } from './views/brand/brand.component';
//adding aditional code
import { TransportationComponent } from './views/transportation/transportation.component';
import { TransportationlistComponent } from './views/transportationlist/transportationlist.component';
import { CategorylistComponent } from './views/categorylist/categorylist.component';
import { SubcategorylistComponent } from './views/subcategorylist/subcategorylist.component';
import { SubcategoryComponent } from './views/subcategory/subcategory.component';
import { ArticlecolorComponent } from './views/articlecolor/articlecolor.component';
import { ArticlesizeComponent } from './views/articlesize/articlesize.component';
import { AccessrightsComponent } from './views/accessrights/accessrights.component';
import { UserlistComponent } from './views/userlist/userlist.component';
import { ArticlecolorlistComponent } from './views/articlecolorlist/articlecolorlist.component';
import { SizelistComponent } from './views/sizelist/sizelist.component';
import { BrandlistComponent } from './views/brandlist/brandlist.component';
import { RacklistComponent } from './views/racklist/racklist.component';
import { RackComponent } from './views/rack/rack.component';
import { VendorlistComponent } from './views/vendorlist/vendorlist.component';
import { OutwardlistComponent } from './views/outwardlist/outwardlist.component';
import { InwardlistComponent } from './views/inwardlist/inwardlist.component';
import { SolistComponent } from './views/solist/solist.component';
import { PolistComponent } from './views/polist/polist.component';
import { AuthGuard } from './_guards';
import { PartymasterComponent } from './views/partymaster/partymaster.component';
import { PartylistComponent } from './views/partylist/partylist.component';
import { ArticlephotoslistComponent } from './views/articlephotoslist/articlephotoslist.component';
import { OutwardchallanComponent } from './views/outwardchallan/outwardchallan.component';
import { InwardchallanComponent } from './views/inwardchallan/inwardchallan.component';
import { PochallanComponent } from './views/pochallan/pochallan.component';
import { SochallanComponent } from './views/sochallan/sochallan.component';
import { SalesreturnComponent } from './views/salesreturn/salesreturn.component';
import { PurchasereturnComponent } from './views/purchasereturn/purchasereturn.component';
import { SostatuslistComponent } from './views/sostatuslist/sostatuslist.component';
import { SostatusComponent } from './views/sostatus/sostatus.component';
import { SalesreturnlistComponent } from './views/salesreturnlist/salesreturnlist.component';
import { PurchasereturnlistComponent } from './views/purchasereturnlist/purchasereturnlist.component';
import { ArticleratechangeComponent } from './views/articleratechange/articleratechange.component';
import { SalesreturnchallanComponent } from './views/salesreturnchallan/salesreturnchallan.component';
import { PurchasereturnchallanComponent } from './views/purchasereturnchallan/purchasereturnchallan.component';
import { ReportsallstocksComponent } from './views/reportsallstocks/reportsallstocks.component';
import { ReportcategoryComponent } from './views/reportcategory/reportcategory.component';
import { PurchasereportlistComponent } from './views/purchasereportlist/purchasereportlist.component';
import { PurchasereportinwardlistComponent } from './views/purchasereportinwardlist/purchasereportinwardlist.component';
import { SalesreportsolistComponent } from './views/salesreportsolist/salesreportsolist.component';
import { WorkorderComponent } from './views/workorder/workorder.component';
import { WorkorderlistComponent } from './views/workorderlist/workorderlist.component';
import { PoreportlistComponent } from './views/poreportlist/poreportlist.component';
import { SofrontdetailsComponent } from './views/sofrontdetails/sofrontdetails.component';
import { SocategorylistComponent } from './views/socategorylist/socategorylist.component';
import { SocartComponent } from './views/socart/socart.component';
import { OutletComponent } from './views/outlet/outlet.component';
import { OutletlistComponent } from './views/outletlist/outletlist.component';
import { OutletchallanComponent } from './views/outletchallan/outletchallan.component';
import { BlankpageComponent } from './views/blankpage/blankpage.component';
import { OutletreportComponent } from './views/outletreport/outletreport.component';
import { SochallanpdfComponent } from './views/sochallanpdf/sochallanpdf.component';
import { MyordersComponent } from './views/myorders/myorders.component';
import { FinancialyearlistComponent } from './views/financialyearlist/financialyearlist.component';
import { FinancialyearComponent } from './views/financialyear/financialyear.component';
import { ProductlaunchComponent } from './views/productlaunch/productlaunch.component';
import { SoremainingchallanComponent } from './views/soremainingchallan/soremainingchallan.component';
import { SalesreportlistComponent } from './views/salesreportlist/salesreportlist.component';
import { ApprovearticlelistComponent } from './views/approvearticlelist/approvearticlelist.component';
import { HoldarticlelistComponent } from './views/holdarticlelist/holdarticlelist.component';
import { RejectedarticlelistComponent } from './views/rejectedarticlelist/rejectedarticlelist.component';
import { ArticlesearchComponent } from './views/articlesearch/articlesearch.component';
import { ImportcsvComponent } from './views/importcsv/importcsv.component';
import { RangeserieslistComponent } from './views/rangeserieslist/rangeserieslist.component';
import { RangeseriesComponent } from './views/rangeseries/rangeseries.component';
import { ArticlelistComponent } from './views/articlelist/articlelist.component';
import { ArticleComponent } from './views/article/article.component';
import { ArticlelaunchlistComponent } from './views/articlelaunchlist/articlelaunchlist.component';
import { ArticlelaunchComponent } from './views/articlelaunch/articlelaunch.component';
import { OutlettransportComponent } from './views/outlettransport/outlettransport.component';
import { StocktransferComponent } from './views/stocktransfer/stocktransfer.component';
import { StocktransferlistComponent } from './views/stocktransferlist/stocktransferlist.component';
import { UserrolelistComponent } from './views/userrolelist/userrolelist.component';
import { UserroleComponent } from './views/userrole/userrole.component';
import { OutletsalesreturnComponent } from './views/outletsalesreturn/outletsalesreturn.component';
import { OutletsalesreturnlistComponent } from './views/outletsalesreturnlist/outletsalesreturnlist.component';
import { OutletsalesreturnchallanComponent } from './views/outletsalesreturnchallan/outletsalesreturnchallan.component';
import { RangestokesreportsComponent } from './views/rangestokesreports/rangestokesreports.component';
import { RangewisedailyreportsComponent } from './views/rangewisedailyreports/rangewisedailyreports.component';


import { OutletarticlesearchComponent } from './views/outletarticlesearch/outletarticlesearch.component';
import { RejectionlistComponent } from './views/rejectionlist/rejectionlist.component';
import { RejectionComponent } from './views/rejection/rejection.component';
import { BugslistComponent } from './views/bugslist/bugslist.component';
import { SoduplicationlistComponent } from './views/soduplicationlist/soduplicationlist.component';
import { OutwardduplicationlistComponent } from './views/outwardduplicationlist/outwardduplicationlist.component';
import { SalesreturnduplicationComponent } from './views/salesreturnduplication/salesreturnduplication.component';
import { OutwardsoremainingComponent } from './views/outwardsoremaining/outwardsoremaining.component';
import { SoremainingComponent } from './views/soremaining/soremaining.component';
import { AllremainingComponent } from './views/allremaining/allremaining.component';
import { StocktransferduplicateComponent } from './views/stocktransferduplicate/stocktransferduplicate.component';
import { UserviewComponent } from "./views/userview/userview.component";
import { UserlogsComponent } from "./views/userlogs/userlogs.component";
import { StocktransferchallanComponent } from "./views/stocktransferchallan/stocktransferchallan.component";
import { OutwardreportComponent } from "./views/outwardreport/outwardreport.component";
import { DailyreportComponent } from './views/dailyreport/dailyreport.component';
import { PoduplicationlistComponent } from './views/poduplicationlist/poduplicationlist.component';
import { InwardduplicationlistComponent } from './views/inwardduplicationlist/inwardduplicationlist.component';
import { LaunchreportComponent } from './views/launchreport/launchreport.component';
import { outletrefilComponent } from './views/outletrefil/outletrefil.component';




export const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full',
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: '404',
  //   component: P404Component,
  //   data: {
  //     title: 'Page 404'
  //   }
  // },
  // {
  //   path: '500',
  //   component: P500Component,
  //   data: {
  //     title: 'Page 500'
  //   }
  // },
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: ''
    },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        // canActivate: [RoleGuard],
        data: { role: '5' },


      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'users/:id',
        component: UsersComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'inward',
        component: InwardComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'outward',
        component: OutwardComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'articlelaunchedit',
        component: ArticlelauncheditComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'so',
        component: SoComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'po',
        component: PoComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'category',
        component: CategoryComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'vendor',
        component: VendorComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'brand',
        component: BrandComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
       //adding aditional code
       {
        path: 'transportation',
        component: TransportationComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'categorylist',
        component: CategorylistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'subcategorylist',
        component: SubcategorylistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'subcategory',
        component: SubcategoryComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'rangeserieslist',
        component: RangeserieslistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'rangeseries',
        component: RangeseriesComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'outletransport',
        component: OutlettransportComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'article',
        component: ArticleComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },

      {
        path: 'articlelist',
        component: ArticlelistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'articlelaunch',
        component: ArticlelaunchComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },

      {
        path: 'articlelaunchlist',
        component: ArticlelaunchlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'importcsv',
        component: ImportcsvComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'articlecolor',
        component: ArticlecolorComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'articlecolor/:id',
        component: ArticlecolorComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'articlesize',
        component: ArticlesizeComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'articlesize/:id',
        component: ArticlesizeComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'articlesearch',
        component: ArticlesearchComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'articlesearch/:id',
        component: ArticlesearchComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'accessrights',
        component: AccessrightsComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'userlist',
        component: UserlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: "articlecolorlist",
        component: ArticlecolorlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: "sizelist",
        component: SizelistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: "brandlist",
        component: BrandlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },

      //adding aditional code

      {
        path: "transportationlist",
        component: TransportationlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: "racklist",
        component: RacklistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: "rack",
        component: RackComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: "vendorlist",
        component: VendorlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'outwardlist',
        component: OutwardlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'inwardlist',
        component: InwardlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'solist',
        component: SolistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'polist',
        component: PolistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'partymaster',
        component: PartymasterComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'partylist',
        component: PartylistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'articleimgslist',
        component: ArticleimgslistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'articlephotos',
        component: ArticlephotosComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'articlephotoslist',
        component: ArticlephotoslistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'sochallan',
        component: SochallanComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'pochallan',
        component: PochallanComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'inwardchallan',
        component: InwardchallanComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'outwardchallan',
        component: OutwardchallanComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'salesreturn',
        component: SalesreturnComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'purchasereturn',
        component: PurchasereturnComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'sostatuslist',
        component: SostatuslistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'sostatus',
        component: SostatusComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'salesreturnlist',
        component: SalesreturnlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'purchasereturnlist',
        component: PurchasereturnlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }

      },
      {
        path: 'articleratechange',
        component: ArticleratechangeComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'salesreturnchallan',
        component: SalesreturnchallanComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'purchasereturnchallan',
        component: PurchasereturnchallanComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'reportsallstocks',
        component: ReportsallstocksComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'exportallstocks',
        component: ReportsallstocksComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'reportcategory',
        component: ReportcategoryComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'purchasereportlist',
        component: PurchasereportlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'purchasereportinwardlist',
        component: PurchasereportinwardlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'salesreportsolist',
        component: SalesreportsolistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      }, {
        path: 'workorder',
        component: WorkorderComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'workorderlist',
        component: WorkorderlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'poreportlist',
        component: PoreportlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      //  {
      //   path: 'sofrontview',
      //   component: SofrontviewComponent,
      //   canActivate: [AuthGuard],
      //   data: { role: '5' }
      // },
      {
        path: 'sofrontdetails',
        component: SofrontdetailsComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      {
        path: 'socategorylist',
        component: SocategorylistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      }, {
        path: 'socart',
        component: SocartComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      }, {
        path: 'outlet',
        component: OutletComponent,
        canActivate: [AuthGuard],
        data: { role: '45' }
      },
      {
        path: 'outletlist',
        component: OutletlistComponent,
        canActivate: [AuthGuard],
        data: { role: '45' }
      },
      {
        path: "outletchallan",
        component: OutletchallanComponent,
        canActivate: [AuthGuard],
        data: { role: '45' }
      },
      {
        path: "newdashboard",
        component: BlankpageComponent,
        //canActivate: [AuthGuard],
        canActivate: [AuthGuard],
        data: { role: '54' },
      },
      {
        path: "outletreport",
        component: OutletreportComponent,
        //canActivate: [AuthGuard],
        canActivate: [AuthGuard],
        data: { role: '54' },
      },
      {
        path: "launchreport",
        component: LaunchreportComponent,
        //canActivate: [AuthGuard],
        canActivate: [AuthGuard],
        data: { role: '5' },
      },

      {
        path: "outletrefil",
        component: outletrefilComponent,
        //canActivate: [AuthGuard],
        canActivate: [AuthGuard],
        data: { role: '5' },
      },


      {
        path: "sochallanpdf",
        component: SochallanpdfComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },

      },
      {
        path: "myorders",
        component: MyordersComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "financialyearlist",
        component: FinancialyearlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "financial",
        component: FinancialyearComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "productlaunch",
        component: ProductlaunchComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "approvearticlelist",
        component: ApprovearticlelistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "holdarticlelist",
        component: HoldarticlelistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "rejectedarticlelist",
        component: RejectedarticlelistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },

      {
        path: "soremainingchallan",
        component: SoremainingchallanComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "salesreportlist",
        component: SalesreportlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "stocktransfer",
        component: StocktransferComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "stocktransferlist",
        component: StocktransferlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "userrole",
        component: UserroleComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "userrolelist",
        component: UserrolelistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "outletsalesreturn",
        component: OutletsalesreturnComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "outletsalesreturnlist",
        component: OutletsalesreturnlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "outletsalesreturnchallan",
        component: OutletsalesreturnchallanComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "rangestokesreports",
        component: RangestokesreportsComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "rangewisedailyreports",
        component: RangewisedailyreportsComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },

      },
      {
        path: "outletarticlesearch",
        component: OutletarticlesearchComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },

      },
      {
        path: "outletarticlesearch/:id",
        component: OutletarticlesearchComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },

      },
      {
        path: "rejectionlist",
        component: RejectionlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "rejection",
        component: RejectionComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "debug",
        component: BugslistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "soduplicationlist",
        component: SoduplicationlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },

      },
      {
        path: "outwardduplicationlist",
        component: OutwardduplicationlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },

      },
      {
        path: "salesreturnduplication",
        component: SalesreturnduplicationComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "outwardsoremaining",
        component: OutwardsoremainingComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "soremaining",
        component: SoremainingComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "allremaining",
        component: AllremainingComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "stocktransferduplicationlist",
        component: StocktransferduplicateComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "poduplicationlist",
        component: PoduplicationlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "inwardduplicationlist",
        component: InwardduplicationlistComponent,
        canActivate: [AuthGuard],
        data: { role: '5' },
      },
      {
        path: "userview",
        component: UserviewComponent,
        canActivate: [AuthGuard],
        data: { role: "5" },
      },
      {
        path: "userview/:id",
        component: UserviewComponent,
        canActivate: [AuthGuard],
        data: { role: "5" },
      },
      {
        path: "userlogs",
        component: UserlogsComponent,
        canActivate: [AuthGuard],
        data: { role: "5" },
      },
      {
        path: "userlogs/:id",
        component: UserlogsComponent,
        canActivate: [AuthGuard],
        data: { role: "5" },
      },
      {
        path: "stocktransferchallan",
        component: StocktransferchallanComponent,
        canActivate: [AuthGuard],
        data: { role: "5" },
      },
      {
        path: "outwardreport",
        component: OutwardreportComponent,
        canActivate: [AuthGuard],
        data: { role: "5" },
      },{
        path: 'dailyreport',
        component: DailyreportComponent,
        canActivate: [AuthGuard],
        data: { role: '5' }
      },
      // {
      //   path: "launchreport",
      //   component: LaunchreportComponent,
      //   canActivate: [AuthGuard],
      //   data: { role: "5" },
      // },
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
