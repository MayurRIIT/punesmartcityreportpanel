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
  selector: 'app-askaquestionreport',
  templateUrl: './askaquestionreport.component.html',
  styleUrls: ['./askaquestionreport.component.scss'],
})
export class AskaquestionreportComponent implements OnInit {

  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  gradeList : any = [];
  subjectList : any = [];
  subjectId  : any = 0;
  gradeId : any = 0;
  mediumsList : any = [];
  mediumId  : any = 0;
  loading : boolean = false;
  datalist : any = [];
  totalVideo : number = 0;
  totalEBook : number = 0;
  totalNotes : number = 0;
  totalAudio : number = 0;
  totalTest : number = 0;
  contentType : any = '';
  searchTerm : string = '';
  gradeData : any = 0;
  subjectData  : any = 0;
  mediumData  : any = 0;
  contentTypeData : any = '';
  //totalInteractiveTestList : number = 0;
  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();

  chapterList : any = [];
  chapterId  : any = 0;

  selectfromdate : string;
  selecttodate : string;
  viewtype : number=0;

  questionId : string ;
  userId : string ;
  answerDescription : string ="";
  fileName : string ="";
  excelfile: any;
  question : string="";
  studentName : string;
  answerImageUrl : string;
  answerVideoUrl : string;
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
    this.getGrade();
    this.getMediumsList();
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

  onMediumChangeGetSubjectList(event){
    console.log(event);
    this.getSubjectList();
  }

  getSubjectList(){
      this.subjectId = 0;
      this.subjectList  = [];
      let mediumId = 0;
      let gradeId = 0;
      if(this.gradeId == "0"){
        gradeId = 0;
      }else{
        gradeId = this.gradeId._id;
      }

      if(this.mediumId == "0"){
        mediumId = 0;
      }else{
        mediumId = this.mediumId._id;
      }

      this.userService.getSubjectList(gradeId,mediumId).subscribe(response => {
        console.log(response);  
            if(response.responseCode == 200){
              this.subjectList = response.result;
            }else{
                this.alertService.error(response.responseMessage);
            }       
      },
      error => {
          this.alertService.error(error);
      });
      
    
  }

  getChapterList(){
    this.userService.getChapterList(this.subjectId._id).subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.chapterList = response.result;
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
      if(this.gradeId == "0"){
        this.alertService.error("Please select grade");
        return;
      }

      if(this.mediumId == "0"){
        this.alertService.error("Please select medium");
        return;
      }

      if(this.subjectId == "0"){
        this.alertService.error("Please select subject");
        return;
      }

      // if(this.userCategory == "0"){
      //     if(this.sponsorId == "0"){
      //       this.alertService.error("Please select sponsor");
      //       return;
      //     }
      // }

      console.log(this.gradeId,this.subjectId)

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

      let subjectId = 0;
      if(this.subjectId == "0"){
        subjectId = 0;
      }else{
        subjectId = this.subjectId._id;
      }

      let chapterId = 0;
      if(this.chapterId == "0"){
        chapterId = 0;
      }else{
        chapterId = this.chapterId._id;
      }
      
      if(this.viewtype == 1){
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
      this.userService.getAskAQuestionsReport(gradeId,mediumId,subjectId,chapterId,this.contentType,this.viewtype,this.selectfromdate,this.selecttodate).subscribe(response => {

            console.log(response);  
            
            //this.totalInteractiveTestList = 0;
            if(response.responseCode == 200){
                this.datalist = response.result.askaquestionquestiondata;
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

    this.question = iData.studentDoubts;
    this.studentName = iData.userId.firstName+" "+iData.userId.lastName;
    this.questionId = iData._id;
    this.questionIndex = iIndex;
    if(iData.solutionStatus && iData.solutionStatus == 'Answered'){
      this.answerDescription = iData?.solution.description;
      this.fileName = "";
      if(iData?.solution && iData?.solution.video)
        this.answerVideoUrl = iData?.solution.video.thumbnailUrl;
      if(iData?.solution && iData?.solution.imageUrl)
        this.answerImageUrl = iData?.solution.imageUrl;
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


  fileChange(element) {
    this.excelfile = element.target.files;
  }




  saveAnswer(){

    if(this.answerDescription == "" && this.fileName == "" && this.excelfile == undefined){
      alert("Please enter atlist one details");
      return;
    }

  
    console.log(this.excelfile);
    const formData = new FormData();  
    formData.append('description', this.answerDescription);  
    formData.append('fileName', this.fileName);  
    formData.append('questionId', this.questionId);  
    if(this.excelfile && this.excelfile.length > 0)
      formData.append('file', this.excelfile[0]);  
    console.log(formData);

    this.userService.addaskaquestionanswer(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.answerDescription == "";
            this.fileName == "";
            this.answerVideoUrl = null;
            this.answerImageUrl = null;
            this.questionId == "";
            this.question = "";
            this.studentName = "";
            this.excelfile == undefined;
            this.datalist[this.questionIndex].solution = response.result.solution;
            this.datalist[this.questionIndex].solutionStatus = response.result.solutionStatus;
            this.alertService.success(" Questions answer updated successfully");
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
