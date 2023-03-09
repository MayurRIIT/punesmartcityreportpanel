import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ExcelService } from '../core/services/excel.service';
import { TableUtil } from '../core/helpers/tableUtil';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-sponsorsumreport',
  templateUrl: './sponsorsumreport.component.html',
  styleUrls: ['./sponsorsumreport.component.scss'],
})
export class SponsorsumreportComponent implements OnInit {

  schoolList : any = [];
  sponsorList : any = [];
  mediumsList : any = [];
  schoolId : any = 0;
  mediumId  : any = 0;
  sponsorId : any = "0";
  totalCouponCode : number = 0;
  activeCouponCode : number = 0;
  selectfromdate : string;
  selecttodate : string;
  loading : boolean = false;
  datalist : any = [];
  today = new Date(Date.now() - 86400000);

  
  sponsorData : any = 0;
  schoolData  : any = 0;
  mediumData  : any = 0;

  viewtype: number = 0;
  selectfromDatadate : string;
  selecttoDatadate : string;

  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService : UserService,
      private alertService: AlertService,
      private excelService:ExcelService
  ) {
    
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 11,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
          'excel'
      ]
    };
  }

  ngAfterViewInit() {
    this.getSponsor();
   // this.getSchoolList();
    this.getMediumsList();
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getSponsor(){
    this.userService.getSponsor().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.sponsorList = [];
            if(localStorage.getItem("userType") == "SPONSOR"){

              for(let data of response.result) {
                if(data._id == localStorage.getItem("sponsorId")){
                  this.sponsorList.push(data);
                  this.sponsorId = data._id;
                  break;
                }
              }
            }else{
              this.sponsorList = [ ...[{  name : "All", _id : "0" }], ...response.result];
              console.log(this.sponsorList,this.sponsorId);
            }
            
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  getSchoolList(){
      this.userService.getSchoolList().subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
              this.schoolList = response.result;
            }else{
                this.alertService.error(response.responseMessage);
            }       
      },
      error => {
          this.alertService.error(error);
      });
  }

  getMediumsList(){
    this.userService.getMediumsList().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.mediumsList = response.result;
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
}
  
  ordinal_suffix_of_eng(i) {
    let j = i % 10,
        k = i % 100;

    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
  }

  loadDashboardData(){

      this.alertService.clear();
    
      if (this.viewtype == 1) {
        if (
          this.selectfromdate == undefined ||
          this.selectfromdate == "" ||
          this.selectfromdate == null
        ) {
          this.alertService.error("Please select from date");
          return;
        }
  
        if (
          this.selecttodate == undefined ||
          this.selecttodate == "" ||
          this.selecttodate == null
        ) {
          this.alertService.error("Please select to date");
          return;
        }
      }
      // if(this.sponsorId == 0){
      //   this.alertService.error("Please select sponsor");
      //   return;
      // }

      // if(this.schoolId == 0){
      //   this.alertService.error("Please select school");
      //   return;
      // }
      console.log(this.sponsorId,this.schoolId,this.mediumId)


      // if(this.selectfromdate  == undefined || this.selectfromdate == "" || this.selectfromdate == null){
      //   this.alertService.error("Please select from date");
      //   return;
      // }

      // if(this.selecttodate == undefined || this.selecttodate == "" || this.selecttodate == null){
      //   this.alertService.error("Please select to date");
      //   return;
      // }

      let sponsorId = this.sponsorId;
      // if(this.sponsorId == "0"){
      //   sponsorId = 0;
      // }else{
      //   sponsorId = this.sponsorId._id;
      // }

      let schoolId = 0;
      if(this.schoolId == "0"){
        schoolId = 0;
      }else{
        schoolId = this.schoolId._id;
      }

      let mediumId = 0;
      if(this.mediumId == "0"){
        mediumId = 0;
      }else{
        mediumId = this.mediumId._id;
      }

     
      this.loading = true;
      this.userService.getSponsorReport(sponsorId,this.viewtype,this.selectfromdate,this.selecttodate,schoolId,mediumId).subscribe(response => {
        console.log(response);  
        if(response.responseCode == 200){
            this.datalist = response.result.gradedata;
            this.totalCouponCode = response.result.totalLicence;
            this.activeCouponCode = response.result.activeLicence;
            if(this.dtElement && this.dtElement.dtInstance){
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                this.dtTrigger.next();
                // Call the dtTrigger to rerender again
              });
              
            }else{
              this.dtTrigger.next();
            }

            this.sponsorData = this.sponsorId;
            this.mediumData = this.mediumId;
            this.schoolData = this.schoolId;
            this.selectfromDatadate  = this.selectfromdate;
            this.selecttoDatadate = this.selecttodate;
            this.loading = false;
            
        }else{
            this.alertService.error(response.responseMessage);
            this.loading = false;
        }       
      },
      error => {
          this.alertService.error(error);
          this.loading = false;
      });
  }
  

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


}
