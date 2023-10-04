import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { environment } from '../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/* public getsiteconfiguration(data) {
        const headers = this.getHeaders();
        return this.httpClient.get("http://192.168.3.71:5716/v1/api/configuration/getSiteConfiguration",data ,httpOptions);
    } */

@Injectable()
export class UserService {
  getarticalratedata() {
    throw new Error('Method not implemented.');
  }
  doArticleCatForm(value: any) {
    throw new Error('Method not implemented.');
  }
  apiURL: string = environment.apiURL;
  //apiURL: string = 'http://192.168.10.68/colorHuntApi/public/api';
  // apiURL: string = 'http://localhost:7080/colorHuntApi/public/api';
  // apiURL: string = 'http://http://127.0.0.1:8000';

  constructor(public http: HttpClient) { }


  public doLogin(data) {
    //var email = data.email;
    //var password = data.password;
    return this.http.post(`${this.apiURL}/dologin`, data);

    // if (data.email === "admin@gmail.com" && data.password === "admin123") {
    //   return {
    //     code: 200,
    //     message: "Login Successful",
    //     data: data
    //   };
    // } else {
    //   return {
    //     code: 503,
    //     message: "Invalid Credentials",
    //     data: null
    //   };
    // }
  }

  public downloadfile(id, colorid) {
    return this.http.get(`${this.apiURL}/getstorage/${id}/${colorid}`);
  }
  public downloadsinglefile(id, colorid) {
    return this.http.get(`${this.apiURL}/getsinglestorage/${id}/${colorid}`);
  }
  //Master API
  public getRole() {
    return this.http.get(`${this.apiURL}/userrole`);
  }
  public cartnopackscheck(data) {
    return this.http.post(`${this.apiURL}/cartnopackscheck`, data);
  }
  public cartplaceorder(data) {
    return this.http.post(`${this.apiURL}/cartplaceorder`, data, httpOptions);
  }
  public searchitem(data) {
    return this.http.post(`${this.apiURL}/frontsearchresult`, data);
  }

  //Dashboard API
  public getdashboard() {
    return this.http.get(`${this.apiURL}/getdashboard`);
  }

  //Article Search API
  public articlecolorcheck(ArticleName) {
    return this.http.post(`${this.apiURL}/articlecolorcheck`, { ArticleName: ArticleName });
  }
  public articlesearch(ArticleName, ColorId, UserId) {
    return this.http.post(`${this.apiURL}/articlesearch`, { ArticleName: ArticleName, ColorId: ColorId, UserId: UserId });
  }

  // Funcitons Added By KTS
  public outletarticlecolorcheck(ArticleName, OutletPartyId) {
    return this.http.post(`${this.apiURL}/outletarticlecolorcheck`, { ArticleName: ArticleName, OutletPartyId: OutletPartyId });
  }
  public outletarticlesearch(ArticleName, ColorId, OutletPartyId) {
    return this.http.post(`${this.apiURL}/outletarticlesearch`, { ArticleName: ArticleName, ColorId: ColorId, OutletPartyId: OutletPartyId });
  }
  public geoutlets(logged_id) {
    return this.http.get(`${this.apiURL}/getoutlets/${logged_id}`);
  }

  // Functions Added By KTS End

  //UserManagment API
  public doUserAdd(data) {
    return this.http.post(`${this.apiURL}/adduser`, data);
  }
  public getAllUsers() {
    return this.http.get(`${this.apiURL}/userlist`);
  }
  public updateCustomer(customer) {
    return this.http.put(`${this.apiURL}/updateuser/${customer.id}`, customer, httpOptions);
  }
  public getuseridwise(id) {
    return this.http.get(`${this.apiURL}/getuseridwise/${id}`);
  }
  public deleteuser(id, LoggedId) {
    return this.http.delete(`${this.apiURL}/deleteuser/${id}/${LoggedId}`);
  }


  //Role Rights API
  public getupdateaddrights(id, actid) {
    return this.http.get(`${this.apiURL}/rolewiseaddupdate/${id}/${actid}`);
  }
  public getroleRights(id) {
    return this.http.get(`${this.apiURL}/userrolerights/${id}`);
  }
  public getroleRightssidebar(id) {
    return this.http.get(`${this.apiURL}/userrolerightssidebar/${id}`);
  }
  public getpages(id) {
    return this.http.get(`${this.apiURL}/userrights/${id}`);
  }

  //Category API
  public docategory(data) {
    return this.http.post(`${this.apiURL}/addcategory`, data);
  }
  public updateCategory(catlist: any) {
    return this.http.post(`${this.apiURL}/updatecategory`, catlist);
  }
  public categorylist() {
    return this.http.get(`${this.apiURL}/categorylist`);
  }
  public getcatidwise(id) {
    return this.http.get(`${this.apiURL}/getcatidwise/${id}`);
  }
  public deletecategory(id) {
    return this.http.delete(`${this.apiURL}/deletecategory/${id}`);
  }


  //SubCategory API
  public dosubcategory(data) {
    return this.http.post(`${this.apiURL}/addsubcategory`, data);
  }
  public updateSubcategory(catlist) {
    return this.http.put(`${this.apiURL}/updatesubcategory/${catlist.id}`, catlist, httpOptions);
  }
  public subcategorylist() {
    return this.http.get(`${this.apiURL}/subcategorylist`);
  }
  public getsubcatidwise(id) {
    return this.http.get(`${this.apiURL}/getsubcategoryidwise/${id}`);
  }
  public getcategoryidwise(id) {
    return this.http.get(`${this.apiURL}/getcategoryidwise/${id}`);
  }
  public deletesubcategory(id) {
    return this.http.delete(`${this.apiURL}/deletesubcategory/${id}`);
  }


  //Range Series API
  public dorangeseries(data) {
    return this.http.post(`${this.apiURL}/addrangeseries`, data);
  }
  public updaterangeseries(serlist) {
    return this.http.put(`${this.apiURL}/updaterangeseries/${serlist.id}`, serlist, httpOptions);
  }
  public rangeserieslist() {
    return this.http.get(`${this.apiURL}/rangeserieslist`);
  }
  public getrangeseriesidwise(id) {
    return this.http.get(`${this.apiURL}/getrangeseriesidwise/${id}`);
  }
  public deleterangeseries(id) {
    return this.http.delete(`${this.apiURL}/deleterangeseries/${id}`);
  }
  public getsubcatrangeserieswise(id) {
    return this.http.get(`${this.apiURL}/getsubcatrangeserieswise/${id}`);
  }



  //Article Series API
  public doarticle(data) {
    return this.http.post(`${this.apiURL}/addarticle`, data);
  }
  public updatearticle(serlist) {
    return this.http.put(`${this.apiURL}/updatearticle/${serlist.id}`, serlist, httpOptions);
  }
  // public articlelist() {
  //   return this.http.get(`${this.apiURL}/articlelist`);
  // }
  public getarticleserial(id, seriesflag, categoryId) {
    return this.http.get(`${this.apiURL}/getarticleserial/${id}/${seriesflag}/${categoryId}`);
  }

  public getarticleidwise(id) {
    return this.http.get(`${this.apiURL}/getarticleidwise/${id}`);
  }
  public deletearticle(id, LoggedId) {
    return this.http.delete(`${this.apiURL}/deletearticle/${id}/${LoggedId}`);
  }

  public deletelaunchedarticle(id, LoggedId) {
    return this.http.delete(`${this.apiURL}/deletelaunchedarticle/${id}/${LoggedId}`);
  }

  public getrangeseriesarticle(catid, subid) {
    return this.http.get(`${this.apiURL}/getrangeseriesarticle/${catid}/${subid}`);
  }
  public getarticlepopending() {
    return this.http.get(`${this.apiURL}/getarticlepopending`);
  }
  public getarticle_catscatserial(id) {
    return this.http.get(`${this.apiURL}/getarticle_catscatserial/${id}`);
  }

  public getartautogenerate(id) {
    return this.http.get(`${this.apiURL}/getartautogenerate/${id}`);
  }
  //import CSV
  public importcsv(data) {
    return this.http.post(`${this.apiURL}/importcsv`, data);
  }
  public importoutletcsv(data) {
    return this.http.post(`${this.apiURL}/importoutletcsv`, data);
  }

  //Artical Color API
  public doarticalcoloradd(data) {
    return this.http.post(`${this.apiURL}/addcolor`, data);
  }
  public updateColor(colorlist) {
    return this.http.put(`${this.apiURL}/updatecolor/${colorlist.id}`, colorlist, httpOptions);
  }
  public colorlist() {
    return this.http.get(`${this.apiURL}/colorlist`);
  }
  public getcoloridwise(id) {
    return this.http.get(`${this.apiURL}/getcoloridwise/${id}`);
  }
  public deletecolor(id) {
    return this.http.delete(`${this.apiURL}/deletecolor/${id}`);
  }


  //Artical Size API
  public doarticalsizeadd(data) {
    return this.http.post(`${this.apiURL}/addsize`, data);
  }
  public updateSize(sizelist) {
    return this.http.put(`${this.apiURL}/updatesize/${sizelist.id}`, sizelist, httpOptions);
  }
  public sizelist() {
    return this.http.get(`${this.apiURL}/sizelist`);
  }
  public getsizeidwise(id) {
    return this.http.get(`${this.apiURL}/getsizeidwise/${id}`);
  }
  public deletesize(id) {
    return this.http.delete(`${this.apiURL}/deletesize/${id}`);
  }

  //Artical Ratio API
  public doarticalratioadd(data) {
    return this.http.post(`${this.apiURL}/addratio`, data);
  }
  public updateRatio(ratiolist) {
    return this.http.put(`${this.apiURL}/updateratio/${ratiolist.id}`, ratiolist, httpOptions);
  }
  public ratiolist() {
    return this.http.get(`${this.apiURL}/ratiolist`);
  }
  public getratioidwise(id) {
    return this.http.get(`${this.apiURL}/getratioidwise/${id}`);
  }
  public deleteratio(id) {
    return this.http.delete(`${this.apiURL}/deleteratio/${id}`);
  }

  //Brand API
  public dobrandadd(data) {
    return this.http.post(`${this.apiURL}/addbrand`, data);
  }
  public updateBrand(brandlist) {
    return this.http.put(`${this.apiURL}/updatebrand/${brandlist.id}`, brandlist, httpOptions);
  }
  public brandlist() {

    return this.http.get(`${this.apiURL}/brandlist`);
  }
  public getbrandidwise(id) {
    return this.http.get(`${this.apiURL}/getbrandidwise/${id}`);
  }
  public deletebrand(id) {
    return this.http.delete(`${this.apiURL}/deletebrand/${id}`);
  }

  //Rack API
  public dorackadd(data) {
    return this.http.post(`${this.apiURL}/addrack`, data);
  }

  // public dorackaddnew(data) {
  //   return this.http.post(`${this.apiURL}/addracknew`, data);
  // }

  public doexitscheck(data) {
    return this.http.post(`${this.apiURL}/checkrackexit`, data, httpOptions);
  }
  public updateRack(racklist) {
    return this.http.put(`${this.apiURL}/updaterack/${racklist.id}`, racklist, httpOptions);
  }
  public racklist() {
    return this.http.get(`${this.apiURL}/racklist`);
  }

  public getrackidwise(id) {
    return this.http.get(`${this.apiURL}/getrackidwise/${id}`);
  }
  public deleterack(id) {
    return this.http.delete(`${this.apiURL}/deleterack/${id}`);
  }

  public rejectionlist() {
    return this.http.get(`${this.apiURL}/rejectionlist`);
  }
  public dorejectionadd(data) {
    return this.http.post(`${this.apiURL}/addrejection`, data);
  }
  public updateRejection(rejectionlist) {
    return this.http.put(`${this.apiURL}/updaterejection/${rejectionlist.id}`, rejectionlist, httpOptions);
  }
  public getrejectidwise(id) {
    return this.http.get(`${this.apiURL}/getrejectidwise/${id}`);
  }
  public deleterejection(id) {
    return this.http.delete(`${this.apiURL}/deleterejection/${id}`);
  }
  public getrejectionlist() {
    return this.http.get(`${this.apiURL}/getrejection`);
  }




  //User Role API
  public douserroleadd(data) {
    return this.http.post(`${this.apiURL}/adduserrole`, data);
  }
  public updateuserrole(userrolelist) {
    return this.http.put(`${this.apiURL}/updateuserrole/${userrolelist.id}`, userrolelist, httpOptions);
  }
  public userrolelist() {
    return this.http.get(`${this.apiURL}/userrolelist`);
  }
  public getuserroleidwise(id) {
    return this.http.get(`${this.apiURL}/getuserroleidwise/${id}`);
  }
  public deleteuserrole(id) {
    return this.http.delete(`${this.apiURL}/deleteuserrole/${id}`);
  }


  //Vendor API
  public dovendorkadd(data) {
    return this.http.post(`${this.apiURL}/addvendor`, data);
  }
  public updateVendor(vendorlist) {
    return this.http.put(`${this.apiURL}/updatevendor/${vendorlist.id}`, vendorlist, httpOptions);
  }
  public vendorlist() {
    return this.http.get(`${this.apiURL}/vendorlist`);
  }
  public getvendoridwise(id) {
    return this.http.get(`${this.apiURL}/getvendoridwise/${id}`);
  }
  public deletevendor(id) {
    return this.http.delete(`${this.apiURL}/deletevendor/${id}`);
  }

  //Party API
  public dopartyadd(data) {
    return this.http.post(`${this.apiURL}/addparty`, data);
  }
  public updateParty(vendorlist) {
    return this.http.put(`${this.apiURL}/updateparty/${vendorlist.id}`, vendorlist, httpOptions);
  }
  public partylist() {
    return this.http.get(`${this.apiURL}/partylist`);
  }
  public outwardpartylist() {
    return this.http.get(`${this.apiURL}/outwardpartylist`);
  }

  public getpartyidwise(id) {
    return this.http.get(`${this.apiURL}/getpartyidwise/${id}`);
  }
  public deleteparty(id) {
    return this.http.delete(`${this.apiURL}/deleteparty/${id}`);
  }
  public getparty() {
    return this.http.get(`${this.apiURL}/getparty`);
  }

  public getoutletpartyoutletreport(id) {
    return this.http.get(`${this.apiURL}/getoutletpartyoutletreport/${id}`);
  }

  public getoutletparty(id) {
    return this.http.get(`${this.apiURL}/getoutletparty/${id}`);
  }
  public getoutletpartystocktransfer(id) {
    return this.http.get(`${this.apiURL}/getoutletpartyinstockstransfer/${id}`); //Jaimin
  }
  public GeOutletPartyarticleratechange(id) {
    return this.http.get(`${this.apiURL}/getoutletpartyforarticalrate/${id}`);//Jaimin
  }
  public getoutletviewparty(id) {
    return this.http.get(`${this.apiURL}/getoutletviewparty/${id}`);
  }
  public updatepartystatus(partyid) {
    return this.http.get(`${this.apiURL}/updatepartystatus/${partyid}`);
  }

  // Code Added By Kts
  public getgeoofparties() {
    return this.http.get(`${this.apiURL}/getgeoofparties`);
  }
  public getsalespersons() {
    return this.http.get(`${this.apiURL}/getsalespersons`);
  }
  public getallparty() {
    return this.http.get(`${this.apiURL}/getallparty`);
  }
  public updateuserstatus(id, LoggedId) {
    return this.http.put(`${this.apiURL}/updateuserstatus/${id}/${LoggedId}`, httpOptions);
  }
  public getpartialarticle() {
    return this.http.get(`${this.apiURL}/getpartialarticle`);
  }
  public getpartialoutletarticle() {
    return this.http.get(`${this.apiURL}/getpartialoutletarticle`);
  }

  //Code Added By Kts End


  // Outlet API
  public getarticleofoutlet(id) {
    return this.http.get(`${this.apiURL}/getarticleofoutlet/${id}`);
  }
  public getoutletsinglearticle(PartyId, ArtId, OutletPartyId) {
    return this.http.get(`${this.apiURL}/getoutletsinglearticle/${PartyId}/${ArtId}/${OutletPartyId}`);
  }
  public dooutletform(data) {
    return this.http.post(`${this.apiURL}/addoutlet`, data);
  }
  public outletlist(userid) {
    return this.http.get(`${this.apiURL}/outletlist/${userid}`);
  }
  public outletlistfromotlno(id) {
    return this.http.get(`${this.apiURL}/outletlistfromotlno/${id}`);
  }
  public outletdatepartyfromotlno(id) {
    return this.http.get(`${this.apiURL}/outletdatepartyfromotlno/${id}`);
  }
  public getoutletidwise(id) {
    return this.http.get(`${this.apiURL}/getoutletidwise/${id}`);
  }
  public updateOutlet(outletlist) {
    return this.http.put(`${this.apiURL}/updateoutlet/${outletlist.id}`, outletlist, httpOptions);
  }
  public deleteoutlet(id, ArticleOpenFlag , LoggedId) {
    return this.http.delete(`${this.apiURL}/deleteoutlet/${id}/${ArticleOpenFlag}/${LoggedId}`);
  }
  public deleteoutletnumber(OTLNO, LoggedId) {
    return this.http.delete(`${this.apiURL}/deleteoutletnumber/${OTLNO}/${LoggedId}`);
  }
  public getoutletchallen(id) {
    return this.http.get(`${this.apiURL}/getoutletchallen/${id}`);
  }
  public updateoutlettransportForm(outlettrasport) {
    return this.http.put(`${this.apiURL}/updatetransportstatus/${outlettrasport.OutwardId}`, outlettrasport, httpOptions);
  }
  public getoutwardpieces(id) {
    return this.http.get(`${this.apiURL}/getoutwardpieces/${id}`);
  }
  //Code Added By KTS
  public getintransitchallan(transitoutletid) {
    return this.http.get(`${this.apiURL}/getintransitchallan/${transitoutletid}`);
  }
  //Code Added By KTS End



  // dooutlettransportForm

  // Transport API
  public getoutwardtransport(partyid) {
    return this.http.get(`${this.apiURL}/getoutwardtransport/${partyid}`);
  }
  public intransitlist(partyid) {
    return this.http.get(`${this.apiURL}/intransitlist/${partyid}`);
  }



  //Inward API
  public doinwardadd(data) {
    return this.http.post(`${this.apiURL}/addinward`, data);
  }
  public updateInward(inward) {
    return this.http.put(`${this.apiURL}/updatinward/${inward.id}`, inward, httpOptions);
  }
  public inwardlist() {
    return this.http.get(`${this.apiURL}/inwardlist`);
  }
  public inwardlistfromgrn(id) {
    return this.http.get(`${this.apiURL}/inwardlistfromgrn/${id}`);
  }
  public inwarddateremarkfromGRN(id) {
    return this.http.get(`${this.apiURL}/inwarddateremarkfromGRN/${id}`);
  }

  public getinwardidwise(id) {
    return this.http.get(`${this.apiURL}/getinwardidwise/${id}`);
  }
  public deleteinward(id, ArticleId ,LoggedId) {
    return this.http.delete(`${this.apiURL}/deleteinward/${id}/${ArticleId}/${LoggedId}`);
  }
  public deleteinwardgrn(GRN, LoggedId) {
    return this.http.delete(`${this.apiURL}/deleteinwardgrn/${GRN}/${LoggedId}`);
  }
  public cancellationinwardgrn(data) {
    //return this.http.post(`${this.apiURL}/cancellationinwardgrn/${GRN}`);
    return this.http.post(`${this.apiURL}/cancellationinwardgrn`, data);
  }
  public getinwardgrn() {
    return this.http.get(`${this.apiURL}/getinwardgrn`);
  }
  public geteditarticalidwise(id) {
    return this.http.get(`${this.apiURL}/geteditarticalidwise/${id}`);
  }
  public getinwardchallen(id, type) {
    return this.http.get(`${this.apiURL}/getinwardchallen/${id}/${type}`);
  }




  //Outward API
  public remainingso(iniOutwardDate) {
    return this.http.get(`${this.apiURL}/remainingso/${iniOutwardDate}`);
  }
  public getsodata(OWNO, id) {
    return this.http.get(`${this.apiURL}/getsodata/${OWNO}/${id}`);
  }
  public getsoarticledata(SOId, id, OWID) {
    return this.http.get(`${this.apiURL}/getsoarticledata/${SOId}/${id}/${OWID}`);
  }
  public dooutwardadd(data) {
    return this.http.post(`${this.apiURL}/addoutward`, data);
  }
  public updateOutward(outward) {
    return this.http.put(`${this.apiURL}/updateoutward/${outward.id}`, outward, httpOptions);
  }
  public outwarddategstfromowno(id) {
    return this.http.get(`${this.apiURL}/outwarddategstfromowno/${id}`);
  }

  public outwardlistfromowno(OWNO) {
    return this.http.get(`${this.apiURL}/outwardlistfromowno/${OWNO}`);
  }
  public outwardlist(UserId) {
    return this.http.get(`${this.apiURL}/outwardlist/${UserId}`);
  }
  public getoutwardidwise(id) {
    return this.http.get(`${this.apiURL}/getoutwardidwise/${id}`);
  }
  public deleteoutward(id, articleId ,LoggedId) {
    return this.http.delete(`${this.apiURL}/deleteoutward/${id}/${articleId}/${LoggedId}`);
  }
  public deleteoutwardnumber(OWNO, SoId, LoggedId) {
    return this.http.delete(`${this.apiURL}/deleteoutwardnumber/${OWNO}/${SoId}/${LoggedId}`);
  }
  public sodropdownlist() {
    return this.http.get(`${this.apiURL}/dropdownlist`);
  }
  public getoutwardchallen(id) {
    return this.http.get(`${this.apiURL}/getoutwardchallen/${id}`);
  }


  //SO API
  public dopurchasereturnform(data) {
    return this.http.post(`${this.apiURL}/addpurchasereturn`, data);
  }
  public dosoform(data) {
    return this.http.post(`${this.apiURL}/addso`, data);
  }
  public updateSo(solist) {
    return this.http.put(`${this.apiURL}/updateso/${solist.id}`, solist, httpOptions);
  }
  public solist(userid) {
    return this.http.get(`${this.apiURL}/solist/${userid}`);
  }
  public admingetuserId() {
    return this.http.get(`${this.apiURL}/admingetuserId`);
  }
  public getsoidwise(id) {
    return this.http.get(`${this.apiURL}/getsoidwise/${id}`);
  }
  public deleteso(id, ArticleOpenFlag ,LoggedId) {
    return this.http.delete(`${this.apiURL}/deleteso/${id}/${ArticleOpenFlag}/${LoggedId}`);
  }
  public remainingarticlelist() {
    return this.http.get(`${this.apiURL}/remainingarticlelist`);
  }

  public remainingarticlelistforoutlet(id) {
    return this.http.get(`${this.apiURL}/remainingarticlelistforoutlet/${id}`);
  }

  public remainingarticlelistsyn(event) {
    return this.http.get(`${this.apiURL}/remainingarticlelistsyn?pid=${event}`);
  }

  public remainingarticlelistWithParty(pId) {
    return this.http.get(`${this.apiURL}/remainingarticlelistWIthParty/${pId}`);
  }

  public getsonumber(userid) {
    return this.http.get(`${this.apiURL}/getsonumber/${userid}`);
  }
  public getinwardarticledataso(userid, partyid, id) {
    // console.log(`${this.apiURL}/getinwardarticledataso/${userid}/${partyid}/${id}`);
    return this.http.get(`${this.apiURL}/getinwardarticledataso/${userid}/${partyid}/${id}`);
  }
  public getinwardarticledata(id) {
    return this.http.get(`${this.apiURL}/getinwardarticledata/${id}`);
  }
  public getpurcahsereturninwardgetdata(vendorId, articleId, inwardNumberId) {
    return this.http.get(`${this.apiURL}/purcahsereturninwardgetdata/${vendorId}/${articleId}/${inwardNumberId}`);
  }

  public getpurchasereturnarticle(id) {
    return this.http.get(`${this.apiURL}/purchasereturnarticle/${id}`);
  }
  public getpurchasereturngetinwardnumber(vendorid, articleid) {
    return this.http.get(`${this.apiURL}/purchasereturngetinwardnumber/${vendorid}/${articleid}`);
  }


  public deletesonumber(SONO, LoggedId) {
    return this.http.delete(`${this.apiURL}/deletesonumber/${SONO}/${LoggedId}`);
  }
  public solistfromsonumber(id) {
    return this.http.get(`${this.apiURL}/solistfromsonumber/${id}`);
  }
  public sodateremarkfromsono(id) {
    return this.http.get(`${this.apiURL}/sodateremarkfromsono/${id}`);
  }
  public getsochallen(id) {
    return this.http.get(`${this.apiURL}/getsochallen/${id}`);
  }
  public sodatacheckuserwise(UserId, SONO) {
    return this.http.get(`${this.apiURL}/sodatacheckuserwise/${UserId}/${SONO}`);
  }
  public remainingoutwardso() {
    return this.http.get(`${this.apiURL}/remainingoutwardso`);
  }

  //Sales Return API
  public srlistfromsronumber(id) {
    return this.http.get(`${this.apiURL}/srlistfromsronumber/${id}`);
  }
  public srdateremarkfromsrono(id) {
    return this.http.get(`${this.apiURL}/srdateremarkfromsrono/${id}`);
  }

  public srolistfromsronumber(id) {
    return this.http.get(`${this.apiURL}/srolistfromsronumber/${id}`);
  }
  public srodateremarkfromsrono(id) {
    return this.http.get(`${this.apiURL}/srodateremarkfromsrono/${id}`);
  }

  public salesreturnoutlet(id) {
    return this.http.get(`${this.apiURL}/salesreturnoutlet/${id}`);
  }
  public salesreturnarticle(id) {
    return this.http.get(`${this.apiURL}/salesreturnarticle/${id}`);
  }

  public salesreturn_outletarticle(id) {
    return this.http.get(`${this.apiURL}/salesreturn_outletarticle/${id}`);
  }

  public salesreturngetarticledata(id) {
    return this.http.get(`${this.apiURL}/salesreturngetarticledata/${id}`);
  }

  public salesreturngetoutwardnumber(PartyId, ArticleId, Type) {
    // console.log(`${this.apiURL}/salesreturngetoutwardnumber/${PartyId}/${ArticleId}/${Type}`);
    return this.http.get(`${this.apiURL}/salesreturngetoutwardnumber/${PartyId}/${ArticleId}/${Type}`);
  }

  public salesreturnoutletgetdata(PartyId, ArticleId, OutletNumberId) {
    // console.log(`${this.apiURL}/salesreturnoutletgetdata/${PartyId}/${ArticleId}/${OutletNumberId}`)
    return this.http.get(`${this.apiURL}/salesreturnoutletgetdata/${PartyId}/${ArticleId}/${OutletNumberId}`);
  }

  public salesreturnoutwardgetdata(PartyId, ArticleId, OutwardNumberId) {
    return this.http.get(`${this.apiURL}/salesreturnoutwardgetdata/${PartyId}/${ArticleId}/${OutwardNumberId}`);
  }

  public doSalesReturnForm(data) {
    return this.http.post(`${this.apiURL}/addsalesreturn`, data);
  }
  public getsalesreturn(id) {
    return this.http.get(`${this.apiURL}/getsalesreturn/${id}`);
  }

  //Outlet sales return
  public doOutletSalesReturnForm(data) {
    return this.http.post(`${this.apiURL}/addoutletsalesreturn`, data);
  }
  public getoutletsalesreturn(id) {
    return this.http.get(`${this.apiURL}/getoutletsalesreturn/${id}`);
  }
  public deleteoutletsalesreturn(id ,LoggedId) {
    return this.http.delete(`${this.apiURL}/deleteoutletsalesreturn/${id}/${LoggedId}`);
  }
  public getoutletsalesreturnchallan(id) {
    return this.http.get(`${this.apiURL}/getoutletsalesreturnchallan/${id}`);
  }

  //Purchase Return
  public prlistfrompronumber(id) {
    return this.http.get(`${this.apiURL}/prlistfrompronumber/${id}`);
  }
  public prdateremarkfromprono(id) {
    return this.http.get(`${this.apiURL}/prdateremarkfromprono/${id}`);
  }

  public getpurchasereturn(id) {
    return this.http.get(`${this.apiURL}/getpurchasereturn/${id}`);
  }
  public deletesalesreturn(id, LoggedId) {
    return this.http.delete(`${this.apiURL}/deletesalesreturn/${id}/${LoggedId}`);
  }
  public deletesalesreturnrecord(id, LoggedId) {
    return this.http.delete(`${this.apiURL}/deletesalesreturnrecord/${id}/${LoggedId}`);
  }
  public deletepurchasereturn(id, LoggedId) {
    return this.http.delete(`${this.apiURL}/deletepurchasereturn/${id}/${LoggedId}`);
  }
  public deletepurchasereturnrecord(id , LoggedId)  {
    return this.http.delete(`${this.apiURL}/deletepurchasereturnrecord/${id}/${LoggedId}`);
  }
  public getsalesreturnchallan(id) {
    return this.http.get(`${this.apiURL}/getsalesreturnchallan/${id}`);
  }
  public getpurchasereturnchallan(id) {
    return this.http.get(`${this.apiURL}/getpurchasereturnchallan/${id}`);
  }

  //Product Lounch API
  public remaininglauncharticle() {
    return this.http.get(`${this.apiURL}/remaininglauncharticle`);
  }
  public doproductlaunchForm(data) {
    return this.http.post(`${this.apiURL}/addproductlaunch`, data);
  }
  public approvalproductlist() {
    return this.http.get(`${this.apiURL}/approvalproductlist`);
  }
  public articlepostlist(data: any){
    return this.http.post(`${this.apiURL}/articlepostlist`,data);
  }
  public rejectedproductlist() {
    return this.http.get(`${this.apiURL}/rejectedproductlist`);
  }
  public launcharticlecheck(id) {
    return this.http.get(`${this.apiURL}/launcharticlecheck/${id}`);
  }
  public holdproductlist() {
    return this.http.get(`${this.apiURL}/holdproductlist`);
  }





  //SO Status API
  public remainingsowithparty(id) {
    return this.http.get(`${this.apiURL}/remainingsowithparty/${id}`);
  }
  public dosoStatusform(data) {
    return this.http.post(`${this.apiURL}/addsostatus`, data);
  }
  public sostatuslist(userid) {
    return this.http.get(`${this.apiURL}/sostatuslist/${userid}`);
  }
  public getsostatus(id) {
    return this.http.get(`${this.apiURL}/getsostatus/${id}`);
  }
  public deletesostatus(id) {
    return this.http.delete(`${this.apiURL}/deletesostatus/${id}`);
  }


  //PO API
  public polistfrompon(id) {
    return this.http.get(`${this.apiURL}/polistfrompon/${id}`);
  }
  public podateremarkfromPO(id) {
    return this.http.get(`${this.apiURL}/podateremarkfromPO/${id}`);
  }
  public dopoform(data) {
    return this.http.post(`${this.apiURL}/addpo`, data);
  }
  public updatePo(id, solist) {
    //return this.http.put(`${this.apiURL}/updatepo/${id}`, solist);
    return this.http.post(`${this.apiURL}/updatepo`, solist);
  }
  public polist() {
    return this.http.get(`${this.apiURL}/polist`);
  }
  public getpoIdwise(id) {
    return this.http.get(`${this.apiURL}/getpoidwise/${id}`);
  }
  public deletepo(id, POId, ArtId ,LoggedId) {
    return this.http.delete(`${this.apiURL}/deletepo/${id}/${POId}/${ArtId}/${LoggedId}`);
  }
  public deletepopon(POId, LoggedId) {
    return this.http.delete(`${this.apiURL}/deletepopon/${POId}/${LoggedId}`);
  }

  public getponumber() {
    return this.http.get(`${this.apiURL}/getponumber`);
  }
  public inwardgetpolist(GRN) {
    return this.http.get(`${this.apiURL}/inwardgetpolist/${GRN}`);
  }
  public getpochallen(id) {
    return this.http.get(`${this.apiURL}/getpochallen/${id}`);
  }
  public getarticaldata(id) {
    return this.http.get(`${this.apiURL}/getarticaldata/${id}`);
  }

  public getanarticaldata(id) {
    return this.http.get(`${this.apiURL}/getanarticaldata/${id}`);
  }

  public getarticallauncheditdata(id) {
    return this.http.get(`${this.apiURL}/getarticaleditdata/${id}`);
  }

  public getarticallaunchdata(id) {
    return this.http.get(`${this.apiURL}/getarticallaunchdata/${id}`);
  }

  public doArticleRateForm(data) {
    return this.http.post(`${this.apiURL}/addarticleratechange`, data);
  }


  public doArticleLaunchForm(data) {
    return this.http.post(`${this.apiURL}/addarticlelaunch`, data); //Nitin
  }

  public editarticlelaunch(data) {
    return this.http.post(`${this.apiURL}/editarticlelaunch`, data); //Nitin
  }

  //Article Photos API
  public articlephotos(formData: any) {
    return this.http.post(`${this.apiURL}/articlephotos`, formData);
  }

  public GetArticlePhotosList() {
    return this.http.get(`${this.apiURL}/getarticlephotoslist`);
  }

  public DeleteArticlePhoto(id, LoggedId) {
    return this.http.delete(`${this.apiURL}/deletearticlephoto/${id}/${LoggedId}`);
  }

  public getarticalIdwise(id) {
    return this.http.get(`${this.apiURL}/getarticalidwise/${id}`);
  }

  public articallist() {
    return this.http.get(`${this.apiURL}/articallist`);
  }

  public articallistoutlet(id) {
    return this.http.get(`${this.apiURL}/articallistoutlet/${id}`);
  }

  public withoutopenflagarticallist() {
    return this.http.get(`${this.apiURL}/withoutopenflagarticallist`);
  }

  public approvedarticallist() {
    return this.http.get(`${this.apiURL}/approvedarticallist`);
  }



  //Reports
  public getsallstocks() {
    return this.http.get(`${this.apiURL}/getsallstocks`);
  }
  public exportallstocks() {
    return this.http.get(`${this.apiURL}/exportallstocks`);
  }
  public reportgetpolist() {
    return this.http.get(`${this.apiURL}/reportgetpolist`);
  }
  public reportgetinwardlist() {
    return this.http.get(`${this.apiURL}/reportgetinwardlist`);
  }
  public reportsolist(userid) {
    return this.http.get(`${this.apiURL}/reportsolist/${userid}`);
  }
  public getoutletstocks(PartyId) {
    return this.http.get(`${this.apiURL}/getoutletstocks/${PartyId}`);
  }

  ////WorkOrderStatus API
  public doworkorderstatusadd(data) {
    return this.http.post(`${this.apiURL}/addworkOrder`, data);
  }
  public updateWorkorderstatus(colorlist) {
    return this.http.put(`${this.apiURL}/updateworkOrder/${colorlist.id}`, colorlist, httpOptions);
  }
  public workorderlist() {
    return this.http.get(`${this.apiURL}/workOrderlist`);
  }
  public getworkorderstatusidwise(id) {
    return this.http.get(`${this.apiURL}/getworkOrderidwise/${id}`);
  }
  public deleteworkorderstatus(id) {
    return this.http.delete(`${this.apiURL}/deleteworkOrder/${id}`);
  }

  //So Front
  public getcategoryarticlelist(id) {
    return this.http.get(`${this.apiURL}/categoryarticlelist/${id}`);
  }

  public getarticledetails(id) {
    return this.http.get(`${this.apiURL}/articledetails/${id}`);
  }

  //Financial Year API
  public doFYadd(data) {
    return this.http.post(`${this.apiURL}/addfy`, data);
  }
  public doexitsfycheck(data) {
    return this.http.post(`${this.apiURL}/checkfyexit`, data, httpOptions);
  }
  public updateFY(FYlist) {
    return this.http.put(`${this.apiURL}/updateFY/${FYlist.id}`, FYlist, httpOptions);
  }
  public getfinancialyearlist() {
    return this.http.get(`${this.apiURL}/fylist`);
  }
  public getfinancialyearidwise(id) {
    return this.http.get(`${this.apiURL}/getFYidwise/${id}`);
  }
  public deletefinancialyear(id) {
    return this.http.delete(`${this.apiURL}/deleteFY/${id}`);
  }


  //Stock Transfer
  public dostocktransferadd(data) {
    return this.http.post(`${this.apiURL}/addstocktransfer`, data);
  }
  public updatestocktransfer(outward) {
    return this.http.put(`${this.apiURL}/updatestocktransfer/${outward.id}`, outward, httpOptions);
  }
  public stocktransferfromstno(id) {
    return this.http.get(`${this.apiURL}/stocktransferfromstno/${id}`);
  }
  public stocktransferlistfromstno(STNO) {
    return this.http.get(`${this.apiURL}/stocktransferlistfromstno/${STNO}`);
  }
  public stockshortagelistfromstno(STNO) {
    return this.http.get(`${this.apiURL}/stockshortagelistfromstno/${STNO}`);
  }
  public stocktransferlist(UserId) {
    return this.http.get(`${this.apiURL}/stocktransferlist/${UserId}`);
  }

  public deletestocktransfer(id, type , LoggedId) {
    return this.http.delete(`${this.apiURL}/deletestocktransfer/${id}/${type}/${LoggedId}`);
  }

  //Bugs apis
  public buglist() {
    return this.http.get(`${this.apiURL}/bugslist`);
  }
  public checksalesretunrduplication() {
    return this.http.get(`${this.apiURL}/checksalesretunrduplication`);
  }
  public checksoduplication() {
    return this.http.get(`${this.apiURL}/checksoduplication`);
  }
  public checkoutwardduplication() {
    return this.http.get(`${this.apiURL}/checkoutwardduplication`);
  }
  public checkpoduplication() {
    return this.http.get(`${this.apiURL}/checkpoduplication`);
  }
  public checkinwardduplication() {
    return this.http.get(`${this.apiURL}/checkinwardduplication`);
  }
  public deletesoduplication(sonumberid, articleid) {
    return this.http.delete(`${this.apiURL}/deletesoduplication/${sonumberid}/${articleid}`);
  }
  public deleteoutwardduplication(outwadnumberid, articleid) {
    return this.http.delete(`${this.apiURL}/deleteoutwardduplication/${outwadnumberid}/${articleid}`);
  }
  public deletesalesretunrduplication(salesreturnnumberid, articleid, CreatedDate) {
    return this.http.delete(`${this.apiURL}/deletesalesreturnduplication/${salesreturnnumberid}/${articleid}/${CreatedDate}`);
  }
  public deletepoduplication(ponumberid , articleid){
    return this.http.delete(`${this.apiURL}/deletepoduplication/${ponumberid}/${articleid}`);
  }
  public deleteinwardduplication(GRNId , articleid){
    return this.http.delete(`${this.apiURL}/deleteinwardduplication/${GRNId}/${articleid}`);
  }
  public outwardsoremaining() {
    return this.http.get(`${this.apiURL}/outwardsoremaining`);
  }
  public fixoutwardsalesremaining(soid, OutwardNoPacksActual) {
    return this.http.get(`${this.apiURL}/fixoutwardsalesremaining/${soid}/${OutwardNoPacksActual}`);
  }
  public fixoutwardsalesremainingbyonce() {
    return this.http.get(`${this.apiURL}/fixoutwardsalesremainingbyonce`);
  }
  public soremaining() {
    return this.http.get(`${this.apiURL}/soremaining`);
  }
  public fixsoremaining(inwardid, newsalespacks) {
    return this.http.get(`${this.apiURL}/fixsoremaining/${inwardid}/${newsalespacks}`);
  }
  public fixsoremainingbyonce() {
    return this.http.get(`${this.apiURL}/fixsoremainingbyonce`);
    
  }
  public allremaining() {
    return this.http.get(`${this.apiURL}/allRemaining`);
  }
  public fixallremaining(mixid, newpacks) {
    return this.http.get(`${this.apiURL}/fixallremaining/${mixid}/${newpacks}`);
  }
  public fixallremainingbyonce() {
    return this.http.get(`${this.apiURL}/fixallremainingbyonce`);
  }
  public checkstocktransferduplication() {
    return this.http.get(`${this.apiURL}/checkstocktransferduplication`);
  }

  public deletestocktransferduplication(stocktransfernumberid, consumedarticleid, transferarticleid) {
    return this.http.delete(`${this.apiURL}/deletestocktaduplication/${stocktransfernumberid}/${consumedarticleid}/${transferarticleid}`);
  }

  //Userlogs
  public viewuser(id) {
    return this.http.get(`${this.apiURL}/userview/${id}`);
  }
  public userlogs(id , value) {
    return this.http.get(`${this.apiURL}/userlogs/${id}/${value}`);
  }
  public deleteuserlogs(id) {
    return this.http.delete(`${this.apiURL}/deleteuserlogs/${id}`);
  }

  //Edit Purchase return
  public getpurchasereturnidwise(id) {
    return this.http.get(`${this.apiURL}/getpurchasereturnidwise/${id}`);
  }
  public updatepurchasereturnform(data) {
    return this.http.post(`${this.apiURL}/updatepurchasereturn`, data);
  }
  public getsalesreturnidwise(id) {
    return this.http.get(`${this.apiURL}/getsalesreturnidwise/${id}`);
  }

  public updateSalesReturnForm(data) {
    return this.http.post(`${this.apiURL}/updatesalesreturn`, data);
  }
  public getstocktransferchallen(id) {
    return this.http.get(`${this.apiURL}/getstocktransferchallen/${id}`);
  }
  public stocktransferdatacheckuserwise(UserId, STNO) {
    return this.http.get(`${this.apiURL}/stocktransferdatacheckuserwise/${UserId}/${STNO}`);
  }

  //Edit Stock Transfer
  public getstocktransferidwise(id) {
    return this.http.get(`${this.apiURL}/getstocktransferidwise/${id}`);
  }
  public updateStockTransfer(data) {

    return this.http.post(`${this.apiURL}/updateStockTransfer`, data);
  }
  public deletestocktransfernumber(id, LoggedId) {
    return this.http.delete(`${this.apiURL}/deletestocktransfernumber/${id}/${LoggedId}`);
  }
  //Outlet selection
  public outletpartylist() {
    return this.http.get(`${this.apiURL}/outletpartylist`);
  }
  //Edit Outlet sales return
  public getoutletsalesreturnidwise(id){
    return this.http.get(`${this.apiURL}/getoutletsalesreturnidwise/${id}`);
  }
  public updateOutletSalesReturnForm(data){
    return this.http.post(`${this.apiURL}/updateOutletSalesReturnForm` , data);
  }
  public getsrangewisedailyreport(RangeDate) {
    return this.http.get(`${this.apiURL}/getsrangewisedailyreport/${RangeDate}`);
  }
  public getsrangewiseoutletdailyreport(RangeDate, OutletPartyId) {
    return this.http.get(`${this.apiURL}/getsrangewiseoutletdailyreport/${RangeDate}/${OutletPartyId}`);
  }

  public getsoutletreport(RangeDate, OutletPartyId) {
    return this.http.get(`${this.apiURL}/getsoutletreport/${RangeDate}/${OutletPartyId}`);
  }

  public getOutwardReport(data) {
    return this.http.post(`${this.apiURL}/getoutwardreport` , data);
  }
  public saveOutwardChallan(file) {
    return this.http.post(`${this.apiURL}/saveoutwardchallan` , file);
  }



  //Logs Modulewise
  // --------------------------------------------
  public articlelogs(id) {
    return this.http.get(`${this.apiURL}/articlelogs/${id}`);
  }

  public articlelaunchlogs(id){
    return this.http.get(`${this.apiURL}/articlelaunchlogs/${id}`); //Nitin
  }

  public pologs(id) {
    return this.http.get(`${this.apiURL}/pologs/${id}`);
  }
  public inwardlogs(GRN) {
    return this.http.get(`${this.apiURL}/inwardlogs/${GRN}`);
  }
  public approvearticlelogs(id) {
    return this.http.get(`${this.apiURL}/approvearticlelogs/${id}`);
  }
  public holdarticlelogs(id) {
    return this.http.get(`${this.apiURL}/holdarticlelogs/${id}`);
  }
  public rejectedarticlelogs(id) {
    return this.http.get(`${this.apiURL}/rejectedarticlelogs/${id}`);
  }
  public sologs(SONOId) {
    return this.http.get(`${this.apiURL}/sologs/${SONOId}`);
  }
  public outwardlogs(OWNOId) {
    return this.http.get(`${this.apiURL}/outwardlogs/${OWNOId}`);
  }
  public salesreturnlogs(SRONOId) {
    return this.http.get(`${this.apiURL}/salesreturnlogs/${SRONOId}`);
  }
  public purchasereturnlogs(PRONOId) {
    return this.http.get(`${this.apiURL}/purchasereturnlogs/${PRONOId}`);
  }
  public outletsalesreturnlogs(OSRONOId) {
    return this.http.get(`${this.apiURL}/outletsalesreturnlogs/${OSRONOId}`);
  }
  public articlephotoslogs(id) {
    return this.http.get(`${this.apiURL}/articlephotoslogs/${id}`);
  }
  public outletlogs(OTLNOId) {
    return this.http.get(`${this.apiURL}/outletlogs/${OTLNOId}`);
  }
  public outlettransportlogs(id) {
    return this.http.get(`${this.apiURL}/outlettransportlogs/${id}`);
  }
  public stocktransferlogs(STNOId) {
    return this.http.get(`${this.apiURL}/stocktransferlogs/${STNOId}`);
  }
}
