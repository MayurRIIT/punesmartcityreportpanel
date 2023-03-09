import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { UserService } from '../core/services/user.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AlertService } from '../core/services/alert.service';
import { TableUtil } from '../core/helpers/tableUtil';
import { MatDialog } from '@angular/material/dialog';
import { SelectTeacherComponent } from '../select-teacher/select-teacher.component';

@Component({
  selector: 'app-view-competition-enroll-user',
  templateUrl: './view-competition-enroll-user.component.html',
  styleUrls: ['./view-competition-enroll-user.component.scss'],
})
export class ViewCompetitionEnrollUserComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  public competitionId: string = '';
  public competitionName: string = '';

  // public gradeId: string = '';
  // public mediumId: string = '';
  loading : boolean = false;
  datalist : any = [];

  title = 'datatables';
  dtOptions: DataTables.Settings =  {};
  dtTrigger: Subject<any> = new Subject<any>();
  userType : string;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private dialog: MatDialog,
    private userService: UserService) {
   
  }

  ngOnInit() {
    this.userType = localStorage.getItem("userType");

    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.competitionId = params.competitionId;
        this.competitionName = params.competitionName;
       // this.gradeId = params.gradeId;
       // this.mediumId = params.mediumId;

        console.log("=========competitionId=====>", this.competitionId);
        this.loadDashboardData();
      });

  }


  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
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

    // if(this.testPaperId == "0"){
    //   this.alertService.error("Please select school");
    //   return;
    // }

    // if(this.gradeId == "0"){
    //   this.alertService.error("Please select class");
    //   return;
    // }

    // if(this.mediumId == "0"){
    //   this.alertService.error("Please select medium");
    //   return;
    // }

    // if(this.subjectId == "0"){
    //   this.alertService.error("Please select subject");
    //   return;
    // }

    console.log(this.competitionId)

    this.loading = true;
    this.userService.getCompetitionEnrollStudent(this.competitionId).subscribe(response => {

          console.log(response);  
          if(response.responseCode == 200){
              this.datalist = response.result;
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





}
