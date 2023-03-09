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
  selector: 'app-view-testseries-response',
  templateUrl: './view-testseries-response.component.html',
  styleUrls: ['./view-testseries-response.component.scss'],
})
export class ViewTestSeriesResponseComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  public testSeriesId: string = '';
  public gradeId: string = '';
  public mediumId: string = '';
  testPaperList : any = [];
  testPaperId  : any = 0;
  loading : boolean = false;
  datalist : any = [];

  title = 'datatables';
  dtOptions: DataTables.Settings =  {};
  dtTrigger: Subject<any> = new Subject<any>();
  userType : string;


  selectedResponses : any = {};
  selectedResponseIds : any = [];

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
        this.testSeriesId = params.testSeriesId;
        this.gradeId = params.gradeId;
        this.mediumId = params.mediumId;

        this.getTestPaper();

        console.log("=========testSeriesId=====>", this.testSeriesId);
      });

  }


  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getTestPaper() {
    this.userService.getTestPaper(this.testSeriesId,this.userType,localStorage.getItem("id"))
      .subscribe((res: any) => {
        console.log('my res', res.result);
        this.testPaperList = res.result.testPaperData;
        this.loadDashboardData();
      })
  }



  getSelectAllResponseSelectionFlag(){
    let checkFlag = this.datalist.length == 0 ? false : true;
    for(let i = 0 ; i < this.datalist.length ; i++){
      let index = this.selectedResponseIds.indexOf(this.datalist[i]._id);
      if(index == -1){
        checkFlag = false;
      }
    }
    return checkFlag;
  }


  onCheckBoxCheckedResonse(iResposeId){
    let index = this.selectedResponseIds.indexOf(iResposeId._id);
    if(index == -1){
      this.selectedResponseIds.push(iResposeId._id);
      this.selectedResponses[iResposeId._id] = iResposeId;
    }else{
      this.selectedResponseIds.splice(index,1);
      delete this.selectedResponses[iResposeId._id];
    }

    console.log(this.selectedResponseIds,this.selectedResponses)
  }
  getResponseSelectionFlag(iResposeId){
    return this.selectedResponseIds.indexOf(iResposeId) == -1 ? false : true;
  }

  onSelectAll(){
    
    if(this.getSelectAllResponseSelectionFlag()){
      for(let i = 0 ; i < this.datalist.length ; i++){
        let index = this.selectedResponseIds.indexOf(this.datalist[i]._id);
        if(index != -1){
          this.selectedResponseIds.splice(index,1);
          delete this.selectedResponses[this.datalist[i]._id];
        }
      }
    }else{
      for(let i = 0 ; i < this.datalist.length ; i++){
        let index = this.selectedResponseIds.indexOf(this.datalist[i]._id);
        if(index == -1){
          this.selectedResponseIds.push(this.datalist[i]._id);
          this.selectedResponses[this.datalist[i]._id] = this.datalist[i];
        }
      }
    }
    
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

    console.log(this.testPaperId)

    let testPaperId = 0;
    if(this.testPaperId == "0"){
      testPaperId = 0;
    }else{
      testPaperId = this.testPaperId._id;
    }


    this.loading = true;
    this.userService.getTestSeriesStudent(this.testSeriesId,testPaperId,this.userType,localStorage.getItem("id")).subscribe(response => {

          console.log(response);  
          if(response.responseCode == 200){
              this.datalist = response.result.testSeriesPaperResponseData;
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

  evalutePaper(iTestPaperResponseId){
    this.router.navigate(['/home/evaluate-testseries-response'], { queryParams: { testSeriesId: this.testSeriesId , testPaperResponseId: iTestPaperResponseId, gradeId : this.gradeId, mediumId : this.mediumId } });

  }


  assignToTeacher(){
    let obj = {
      examResponseObj: {
        testSeriesId : this.testSeriesId,
        testPaperId : this.testPaperId._id,
        gradeId : this.gradeId,
        mediumId : this.mediumId,
        testPaperResponseIds : this.selectedResponses
      },
    }
    this.dialog.open(SelectTeacherComponent, {
      data: obj
    });

    
  }

}
