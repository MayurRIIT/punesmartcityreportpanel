import { Component, OnInit , ViewChild,ElementRef } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { UserService } from '../core/services/user.service';
import { ExcelService } from '../core/services/excel.service';
import { TableUtil } from '../core/helpers/tableUtil';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.scss'],
})
export class QuestionBankComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  gradeList : any = [];
  subjectList : any = [];
  subjectId  : any = 0;
  gradeId : any = 0;
  mediumsList : any = [];
  mediumId  : any = 0;
  loading : boolean = false;
  datalist : any = [];
  chapterId : any = 0;
  chapterList : any = [];

  closeResult: string;

  searchTerm : string = '';
  gradeData : any = 0;
  subjectData  : any = 0;
  mediumData  : any = 0;
  chapterData : any = '';
  //totalInteractiveTestList : number = 0;
  
  selectedQuestions : any = {};
  selectedQuestionIds : any = [];

  schoolIdFHideExportBtn :  any = 0;
  schoolId :  any = 0;
  schoolIdBU :  any = 0;
  schoolIdF :  any = 0;
  schoolList : any = [];
  testTitle : string = '';
  testDescription : string = '';
  testMinute : number ;
  createTestFlag : boolean = false;

  title = 'datatables';
  dtOptions: DataTables.Settings =  {};
  dtTrigger: Subject<any> = new Subject<any>();


  gradeListBU : any = [];
  subjectListBU : any = [];
  subjectIdBU  : any = 0;
  gradeIdBU : any = 0;
  mediumsListBU : any = [];
  mediumIdBU  : any = 0;
  excelfile: any;
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

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   processing: true,
    //   dom: 'Bfrtip',
    //   // buttons: [
    //   //     'excel'
    //   // ]
    // };

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  }

  ngAfterViewInit() {
    this.getGrade();    
    this.getMediumsList();
    this.getSchoolList();
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTableMain");
  }

  getGrade(){
    this.userService.getGrade().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.gradeList = response.result;
            this.gradeListBU = response.result;

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
            this.mediumsListBU = response.result;
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  getSchoolList(){
    this.userService.getQBSchoolList().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.schoolList = [];
            if(localStorage.getItem("userType") == "SCHOOL" || localStorage.getItem("userType") == "PRINCIPAL" || localStorage.getItem("userType") == "TEACHER"){
              this.schoolList.push({  schoolName : "MDM Bank", _id : "1" });
              for(let data of response.result) {
                if(data._id == localStorage.getItem("schoolId")){
                  this.schoolList.push(data);
                  this.schoolId = data._id;
                  this.schoolIdBU = data._id;
                  //this.schoolIdF = data._id;
                  break;
                }
              }
            }else{
              this.schoolList = [ ...[{  schoolName : "MDM Bank", _id : "1" }], ...response.result];
              console.log(this.schoolList,this.schoolId);
            }
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  onMediumChangeGetSubjectList(event,type=0){
    console.log(event);
    if(type == 0)
      this.getSubjectList();
    else
      this.getSubjectListBU();
  }

  getSubjectListBU(){
    this.subjectIdBU = 0;
    this.subjectListBU  = [];
    let mediumId = 0;
    let gradeId = 0;
    
    if(this.gradeIdBU == "0"){
      gradeId = 0;
    }else{
      gradeId = this.gradeIdBU._id;
    }

    if(this.mediumIdBU == "0"){
      mediumId = 0;
    }else{
      mediumId = this.mediumIdBU._id;
    }

    this.userService.getSubjectList(gradeId,mediumId).subscribe(response => {
      console.log(response);  
          if(response.responseCode == 200){
            this.subjectListBU = response.result;
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
    
  
}

  getSubjectList(){
      this.subjectId = 0;
      this.subjectList  = [];
      let mediumId = 0;
      let gradeId = 0;
      this.chapterId = 0;
      this.chapterList  = [];

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
  
    this.chapterId = 0;
    this.chapterList  = [];
    console.log(this.subjectId);
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

  getQuestionSelectionFlag(iQuestionId){
      return this.selectedQuestionIds.indexOf(iQuestionId) == -1 ? false : true;
  }

  onCheckBoxCheckedQuestion(iQuestionId){
    let index = this.selectedQuestionIds.indexOf(iQuestionId._id);
    if(index == -1){
      this.selectedQuestionIds.push(iQuestionId._id);
      this.selectedQuestions[iQuestionId._id] = iQuestionId;
    }else{
      this.selectedQuestionIds.splice(index,1);
      delete this.selectedQuestions[iQuestionId._id];
    }

    console.log(this.selectedQuestionIds,this.selectedQuestions)
  }

  getSelectAllQuestionSelectionFlag(){
    let checkFlag = this.datalist.length == 0 ? false : true;
    for(let i = 0 ; i < this.datalist.length ; i++){
      let index = this.selectedQuestionIds.indexOf(this.datalist[i]._id);
      if(index == -1){
        checkFlag = false;
      }
    }
    return checkFlag;
  }

  onSelectAll(){
    
    if(this.getSelectAllQuestionSelectionFlag()){
      for(let i = 0 ; i < this.datalist.length ; i++){
        let index = this.selectedQuestionIds.indexOf(this.datalist[i]._id);
        if(index != -1){
          this.selectedQuestionIds.splice(index,1);
          delete this.selectedQuestions[this.datalist[i]._id];
        }
      }
    }else{
      for(let i = 0 ; i < this.datalist.length ; i++){
        let index = this.selectedQuestionIds.indexOf(this.datalist[i]._id);
        if(index == -1){
          this.selectedQuestionIds.push(this.datalist[i]._id);
          this.selectedQuestions[this.datalist[i]._id] = this.datalist[i];
        }
      }
    }
    
  }

  loadDashboardData(){
      this.alertService.clear();

      if(this.schoolIdF == 0){
        this.alertService.error("Please select school");
        return;
      }

      if(this.gradeId == "0"){
        this.alertService.error("Please select class");
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

      console.log(this.gradeId,this.subjectId)

      let gradeId = this.gradeId._id;
      let mediumId = this.mediumId._id;
      let subjectId = this.subjectId._id;
      
      let chapterId = 0;
      if(this.chapterId == "0"){
        chapterId = 0;
      }else{
        chapterId = this.chapterId._id;
      }

      this.loading = true;

      //let schoolId = (this.schoolIdF == 1 || this.schoolIdF == "1") ? this.schoolIdF : this.schoolIdF._id;
      let schoolId = this.schoolIdF;
      this.userService.getQuestionBanks(schoolId,gradeId,mediumId,subjectId,chapterId).subscribe(response => {

            console.log(response);  
            if(response.responseCode == 200){


              
                this.datalist = response.result.questionData;
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
                
                

                this.schoolIdFHideExportBtn = this.schoolIdF;

               
                if(this.subjectData && this.subjectData._id != this.subjectId._id){
                  this.selectedQuestionIds = [];// For one subject test
                  this.selectedQuestions = {};// For one subject test
                }
            
  
                
                this.gradeData = this.gradeId;
                this.mediumData = this.mediumId;
                this.subjectData = this.subjectId;
                this.chapterData = this.chapterId;      
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
  
  openBModel(content) {


    this.modalService.open(content, { windowClass : "selectedQuestionModalClass", ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  createATest(createatest){
    this.openBModel(createatest);
  }
  
  onChangeMarks(){
    console.log(this.selectedQuestions);
     
  }

  getCalculatedTestMarks(){
    console.log(" getCalculatedTestMarks ----------------");
    let testTotalMarks = 0;
    for(let key in this.selectedQuestions){
      console.log(this.selectedQuestions[key]);
      testTotalMarks += this.selectedQuestions[key].questionMark
    }

    console.log(testTotalMarks);

    return testTotalMarks;

  }

  addTest(){

    if(this.schoolId == 0){
      this.alertService.error("Please select school");
      return;
    }

    if(this.testTitle == ""){
      this.alertService.error("Please test title");
      return;
    }

    if(this.testDescription == ""){
      this.alertService.error("Please enter test description");
      return;
    }

    if(this.testMinute == null || this.testMinute == undefined){
      this.alertService.error("Please enter test time in min");
      return;
    }

    let questionArray = []
    let chapterIds = []

    let testTotalMarks = 0;
    for(let key in this.selectedQuestions){
      if(this.selectedQuestions[key].questionMark == 0){
          break;
      }
      testTotalMarks += this.selectedQuestions[key].questionMark

      if(this.selectedQuestions[key].chapterId){
        if(chapterIds.indexOf(this.selectedQuestions[key].chapterId._id) == -1){
          chapterIds.push(this.selectedQuestions[key].chapterId._id);
        }
      }
      
      questionArray.push({  question : this.selectedQuestions[key]._id, questionMark :  this.selectedQuestions[key].questionMark } );
    }


    if(testTotalMarks == 0){
      this.alertService.error("Please enter question marks");
      return;
    }

    let _testObj = {
      schoolId : this.schoolId,
      testTitle : this.testTitle,
      testDescription : this.testDescription,
      testMinute : this.testMinute,
      testMarks : testTotalMarks,
      questionArray,
      gradeId : this.gradeId._id,
      mediumId : this.mediumId._id,
      subjectId : this.subjectId._id,
      chapterId : chapterIds,
    }

    console.log(this.gradeId,this.subjectId,this.chapterId)
    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.createTest(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.selectedQuestionIds = [];// For one subject test
            this.selectedQuestions = {};// For one subject test
            this.resetForm();
            this.alertService.success("Exam created successfully");
            this.modalService.dismissAll('Close');
            
          }else{
              this.alertService.error(response.responseMessage);
              this.createTestFlag = false;
          }       
    },
    error => {
        this.alertService.error(error);
        this.createTestFlag = false;
    });
    
  }

  resetForm(){

    this.schoolId = 0;
    this.testTitle = "";
    this.testDescription = "";
    this.testMinute = 0;
    
  }


  fileChange(element) {
    this.excelfile = element.target.files;
  }

  saveBulkUpload(){

    if(this.schoolIdBU == 0){
      this.alertService.error("Please select school");
      return;
    }

    if(this.gradeIdBU == 0){
      this.alertService.error("Please select class");
      return;
    }

    if(this.mediumIdBU == 0){
      this.alertService.error("Please select medium");
      return;
    }

    if(this.subjectIdBU == 0){
      this.alertService.error("Please select subject");
      return;
    }

    if(this.excelfile == undefined || this.excelfile == null){
      this.alertService.error("Please select file");
      return;
    }

    console.log(this.excelfile);
    const formData = new FormData();  
    formData.append('gradeId', this.gradeIdBU._id);  
    formData.append('mediumId', this.mediumIdBU._id);  
    formData.append('subjectId', this.subjectIdBU._id);  
    //formData.append('schoolId', (this.schoolIdBU == 1 || this.schoolIdBU == "1") ? this.schoolIdBU : this.schoolIdBU._id);  
    formData.append('schoolId', this.schoolIdBU);  
    
    formData.append('file', this.excelfile[0]);  
    console.log(formData);

    this.userService.bulkupload(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.gradeIdBU == 0;
            this.mediumIdBU == 0;
            this.subjectIdBU == 0;
            this.excelfile = undefined;
            this.alertService.success(response.result + " questions uploaded successfully");
            this.modalService.dismissAll('Close');
            
          }else{
              this.alertService.error(response.responseMessage);
              this.createTestFlag = false;
          }       
    },
    error => {
        this.alertService.error(error);
    });


  }


}
