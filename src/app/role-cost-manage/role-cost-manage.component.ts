import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ExcelService } from '../core/services/excel.service';
import { TableUtil } from '../core/helpers/tableUtil';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-cost-manage',
  templateUrl: './role-cost-manage.component.html',
  styleUrls: ['./role-cost-manage.component.scss'],
})
export class RoleCostManageComponent implements OnInit {

  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;


  loading : boolean = false;
  datalist : any = [];
  searchTerm : string = '';
  RolesList : any = [];
  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private modalService: NgbModal,
      private authenticationService: AuthenticationService,
      private userService : UserService,
      private alertService: AlertService,
      private excelService:ExcelService
  ) {
    
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
          // 'excel'
      ]
    };
  }

  ngAfterViewInit() {
  //  this.getGrade();
   // this.getRoles();
    this.loadDashboardData();
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  // getGrade(){
  //   this.userService.getGrade().subscribe(response => {
  //         console.log(response);  
  //         if(response.responseCode == 200){
  //           //this.gradeList = response.result;
  //         }else{
  //             this.alertService.error(response.responseMessage);
  //         }       
  //   },
  //   error => {
  //       this.alertService.error(error);
  //   });
  // }


  // getRoles(){
  //   this.userService.getRoles().subscribe(response => {
  //         console.log(response);  
  //         if(response.responseCode == 200){
  //           this.RolesList = response.result;
  //         }else{
  //             this.alertService.error(response.responseMessage);
  //         }       
  //   },
  //   error => {
  //       this.alertService.error(error);
  //   });
  // }
  
  loadDashboardData(){

      this.alertService.clear();  
      this.datalist = [];
      this.loading = true;
      this.userService.getRoleCostManageData().subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
                let datalist = response.result;
                let tempDataList = {

                }

                if(datalist){
                  for(let i = 0; i < datalist.length; i++){
                    tempDataList[datalist[i].userType+'-'+datalist[i].licenseCount] = datalist[i];
                  }  
                }
                
                for(let i = 0; i < 10; i++){
                    this.datalist.push({
                        "licenseCount": (i+1),
                        "studentCost" : {
                          "cost": tempDataList["STUDENT"+"-"+(i+1)] ? tempDataList["STUDENT"+"-"+(i+1)].cost : 0,
                          "_id" : tempDataList["STUDENT"+"-"+(i+1)] ? tempDataList["STUDENT"+"-"+(i+1)]._id : "",
                          "tax" : tempDataList["STUDENT"+"-"+(i+1)] ? tempDataList["STUDENT"+"-"+(i+1)].tax : 0,
                        },
                        "teacherCost" : {
                          "cost": tempDataList["TEACHER"+"-"+(i+1)] ? tempDataList["TEACHER"+"-"+(i+1)].cost : 0,
                          "_id" : tempDataList["TEACHER"+"-"+(i+1)] ? tempDataList["TEACHER"+"-"+(i+1)]._id : "",
                          "tax" : tempDataList["TEACHER"+"-"+(i+1)] ? tempDataList["TEACHER"+"-"+(i+1)].tax : 0,
                        },
                        "parentCost" : {
                          "cost": tempDataList["PARENT"+"-"+(i+1)] ? tempDataList["PARENT"+"-"+(i+1)].cost : 0,
                          "_id" : tempDataList["PARENT"+"-"+(i+1)] ? tempDataList["PARENT"+"-"+(i+1)]._id : "",
                          "tax" : tempDataList["PARENT"+"-"+(i+1)] ? tempDataList["PARENT"+"-"+(i+1)].tax : 0,
                        },
                        "otherCost" : {
                          "cost": tempDataList["OTHER"+"-"+(i+1)] ? tempDataList["OTHER"+"-"+(i+1)].cost : 0,
                          "_id" : tempDataList["OTHER"+"-"+(i+1)] ? tempDataList["OTHER"+"-"+(i+1)]._id : "",
                          "tax" : tempDataList["OTHER"+"-"+(i+1)] ? tempDataList["OTHER"+"-"+(i+1)].tax : 0,
                        },

                        
                        "status": "ACTIVE"
                    
                    });
                }
              
                this.loading = false;
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
  
  saveProcingModel(iData,iType){
    console.log(iData,iType);

    let rolepriceId = "";
    let cost = 0;
    let tax = 0;
    if(iType == 'STUDENT'){
      rolepriceId = iData.studentCost._id;
      cost = iData.studentCost.cost;
      tax = iData.studentCost.tax;
    }

    if(iType == 'TEACHER'){
      rolepriceId = iData.teacherCost._id;
      cost = iData.teacherCost.cost;
      tax = iData.teacherCost.tax;
    }

    if(iType == 'PARENT'){
      rolepriceId = iData.parentCost._id;
      cost = iData.parentCost.cost;
      tax = iData.parentCost.tax;
    }

    if(iType == 'OTHER'){
      rolepriceId = iData.otherCost._id;
      cost = iData.otherCost.cost;
      tax = iData.otherCost.tax;
    }

    if(cost == 0){
      this.alertService.error("Please enter cost");
      return;
    }

    let formData = {
      userType: iType,
      licenseCount:iData.licenseCount,
      cost:cost,
      tax:tax,
      rolepriceId
    }
    
    this.userService.updateRoleCost(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
           
            alert(response.responseMessage);

            this.modalService.dismissAll('Close');
            this.loadDashboardData();

          }else{
            this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  saveUserDetails(){


    // this.userService.updateStudentInformation(formData).subscribe((response) => {

    //       console.log(response);  
    //       if(response.responseCode == 200){
           
    //         this.alertService.success(response.responseMessage);
    //         this.modalService.dismissAll('Close');
    //       }else{
    //         this.alertService.error(response.responseMessage);
    //       }       
    // },
    // error => {
    //     this.alertService.error(error);
    // });


  }
}
