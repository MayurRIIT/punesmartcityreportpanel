import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-helpsupportcallbackrequestreport',
  templateUrl: './helpsupportcallbackrequestreport.component.html',
  styleUrls: ['./helpsupportcallbackrequestreport.component.scss'],
})
export class HelpsupportcallbackrequestreportComponent implements OnInit {

  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  gradeList : any = [];
  gradeId : any = 0;
  mediumsList : any = [];
  mediumId  : any = 0;
  loading : boolean = false;
  datalist : any = [];
  searchTerm : string = '';
  gradeData : any = 0;
  mediumData  : any = 0;

  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();

  selectfromdate : string;
  selecttodate : string;
  viewtype : number=0;

  questionId : string ;
  answerDescription : string ="";
  studentName : string;
  questionIndex: number = 0;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService : UserService,
      private alertService: AlertService,
      private excelService:ExcelService,
      private modalService: NgbModal

  ) {
    
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
          'excel'
      ]
    };

  }

  ngAfterViewInit() {
    //this.getGrade();
    //this.getMediumsList();
    this.loadDashboardData(false);
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getGrade(){
    this.userService.getGrade().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.gradeList = response.result;
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

  loadDashboardData(iButtonClick){
      this.alertService.clear();
      // if(this.gradeId == "0"){
      //   this.alertService.error("Please select grade");
      //   return;
      // }

      // if(this.mediumId == "0"){
      //   this.alertService.error("Please select medium");
      //   return;
      // }


      // if(this.userCategory == "0"){
      //     if(this.sponsorId == "0"){
      //       this.alertService.error("Please select sponsor");
      //       return;
      //     }
      // }

      console.log(this.gradeId,this.mediumId)

      let gradeId = 0;
      if(this.gradeId == "0"){
        gradeId = 0;
      }else{
        gradeId = this.gradeId._id;
      }

      let mediumId = 0;
      if(this.mediumId == "0"){
        mediumId = 0;
      }else{
        mediumId = this.mediumId._id;
      }

      if(iButtonClick){//this.viewtype == 1
        this.viewtype = 1;
        if(this.selectfromdate  == undefined || this.selectfromdate == "" || this.selectfromdate == null){
          this.alertService.error("Please select from date");
          return;
        }

        if(this.selecttodate == undefined || this.selecttodate == "" || this.selecttodate == null){
          this.alertService.error("Please select to date");
          return;
        }
      }

      this.loading = true;
      this.userService.getHelpSupportCallbackRequestQuestionsReport(gradeId,mediumId,this.viewtype,this.selectfromdate,this.selecttodate).subscribe(response => {

            console.log(response);  
            this.viewtype = 0;
            //this.totalInteractiveTestList = 0;
            if(response.responseCode == 200){
                this.datalist = response.result.data;
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
  
  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onAddAnswer(iIndex,iData,iModel){

    console.log(iData);
    this.studentName = iData.userId.firstName+" "+iData.userId.lastName;
    this.questionId = iData._id;
    this.questionIndex = iIndex;
    this.answerDescription = "";
    if(iData.solutionStatus && iData.solutionStatus == 'Answered'){
      this.answerDescription = iData?.solution.description;
    }

    this.openBModel(iModel);
  }

  openBModel(content) {


    this.modalService.open(content, { windowClass : "selectedQuestionModalClass", ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }



  saveAnswer(){

    if(this.answerDescription == ""){
      alert("Please enter description");
      return;
    }

  
    let _userObj = {
      description : this.answerDescription,
      questionId : this.questionId,
    }


    this.userService.addHelpSupportCallBackRequestAnswer(_userObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.answerDescription == "";
            this.questionId == "";
            this.studentName = "";
            this.datalist[this.questionIndex].status = response.result.status;
            this.datalist[this.questionIndex].actionText = response.result.actionText;
            this.alertService.success("Callback request status updated successfully");
            this.modalService.dismissAll('Close');
            
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });


  }


}
