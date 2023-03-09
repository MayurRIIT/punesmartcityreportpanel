import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
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
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.scss'],
})
export class CompetitionsComponent implements OnInit {

 
  competitionList : any = [];
  loading : boolean = false;
  alertmessage : any;
  alertBUmessage : any;
  alertCCmessage : any;
  alertCSAmessage : any;
  alertSNmessage : any;
  alertCAmessage : any;
  
  competitionIdForm : any = 0;

  gradeList : any = [];
  gradeId : any = 0;
  mediumsList : any = [];
  mediumId  : any = [];
  sponsorList : any = [];
  sponsorId  : any = 0;
  userType : string;
  competitionAccess : string = "ALL_MDM";
  bulkuploadschoolUdiseCodeexcelFile: any  = null;
  competitionAccessSchoools  : any = [];

  // subjectList : any = [];
  // subjectId : any = 0;
  modelBtnTitle : string = "Add";
  bulkuploadexcelFile: any  = null;
  questionPaperFile: any  = null;
  answerKeyFile: any = null;

  competitionModelHeader : string = 'Create a new Competition';
  competitionModelBtn : string = 'Add';

  notificationtitle : string = '';
  notificationdescription : string = '';
  displayTarget : string = 'ONLY_REGISTERED';


  competitionName : string = '';
  competitionDescription : string = '';
  thumbnail : string = '';
  startDate : string ;
  startTime : string ;
  positiveMarks : number = 0;
  negativeMarks : number = 0;
  duration : number = 0;
  isCompetitionFree : string = 'FREE';
  cost : number = 0;
  bannerBeforeStart : string = '';
  flashscreenImage : string = '';
  bannerAfterSubmit : string = '';
  messageBeforePublishResult : string = '';
  competitionRule : string = '';
  descriptionUrl : string = '';
  // IsCompetitionFtee : string = "0";
  createTestFlag : boolean = false;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  
  usersList : any = [];
  competitionQuestions : any = [];
  competitionNotifications : any = [];

  competitionIndex : number = -1;
  competitionData: any = null;
  title = 'datatables';
  dtOptions: DataTables.Settings =  {};
  dtTrigger: Subject<any> = new Subject<any>();

  publishResult : any = false;
  publishReview : any = false;
  publishCertificate : any = false;

  isSchoolListUplading : boolean = false;
  isQuestionListUplading : boolean = false;
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
    this.userType = localStorage.getItem("userType");

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

  }

  ngAfterViewInit() {
    this.getGrade();    
    this.getMediumsList();
    this.getSponsor();
    this.getCompetition();
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
            this.mediumId = [];
            this.mediumsList.forEach((mediumelement)=>{
                this.mediumId.push(mediumelement._id)
            })
            
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  getSponsor(){
    this.userService.getSponsor().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.sponsorList = response.result;
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

  resetTSPapaerModel(){
    this.modelBtnTitle="Add";
    this.questionPaperFile = "";
    this.answerKeyFile = "";
    this.getCompetition();
  }

  loadAddCompetitionModel(content){

    this.mediumId = [];
    this.mediumsList.forEach((mediumelement)=>{
        this.mediumId.push(mediumelement._id)
    })
    this.modelBtnTitle="Add";
    this.showaddTSModel(content);
  }
  
  showaddTSModel(content) {

    this.alertmessage = null;
  
    this.modalService.open(content, { windowClass : "selectedQuestionModalClass", ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      let closeResult = `Closed with: ${result}`;
      console.log("closeResult -- ",closeResult);
    }, (reason) => {
      let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log("closeResult -- ",closeResult);
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

  getCompetition(){
    this.loading = true;

    this.userService.getCompetition().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.loading = false;
            this.competitionList = response.result;
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
        this.loading = false;
        this.alertService.error(error);
    });
  }

  viewSchoolList(iIndex,iContent){

    this.competitionIndex = iIndex;
    this.competitionData = this.competitionList[iIndex];
    
    this.userService.getCompetitionAccessSchools(this.competitionList[iIndex]._id).subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.competitionAccessSchoools = response.result;
            if(iContent)
              this.showaddTSModel(iContent);

          }else{
              this.alertService.error(response.responseMessage);
              this.loading = false;

          }       
    },
    error => {
        this.loading = false;
        this.alertService.error(error);
    });
  }

  addTest(){

    this.alertCCmessage = null;
    if(this.gradeId == 0){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select class" };
      return;
    }

    if(this.mediumId.length == 0){
      this.alertCCmessage.error("Please select medium");
      return;
    }

    let sponsorId = null;
    if(this.sponsorId != 0){
      sponsorId = this.sponsorId;
      //this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select sponsor" };
      //return;
    }

    if(this.competitionName == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition name" };
      return;
    }

    if(this.competitionDescription == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition description" };
      return;
    }

    if(this.thumbnail == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition thumbnail url" };
      return;
    }

    if(this.startDate == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select competition start Date" };
      return;
    }

    if(this.startTime == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select competition start time" };
      return;
    }

    if(this.positiveMarks == 0){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter positive marks" };
      return;
    }

    if(this.negativeMarks < 0){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter negative marks" };
      return;
    }

    if(this.duration == 0){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter duration" };
      return;
    }

    let startDateTime = new Date(this.startDate+" "+this.startTime);

    if(this.isCompetitionFree == "PAID"){
      if(this.cost == 0){
        this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter cost" };
        return;
      }    
    }
    
    if(this.bannerBeforeStart == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter banner image(Before Test Start) url" };
      return;
    }

    if(this.flashscreenImage == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter flashscreen url" };
      return;
    }

    if(this.bannerAfterSubmit == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter banner image(After Test Submit) url" };
      return;
    }


    if(this.messageBeforePublishResult == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter message" };
      return;
    }

    if(this.competitionRule == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition rule" };
      return;
    }

    if(this.descriptionUrl == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition description url" };
      return;
    }


    let _testObj = {
      name : this.competitionName,
      description : this.competitionDescription,
      thumbnail : this.thumbnail,
      startTime : startDateTime,
      positiveMarks : this.positiveMarks,
      negativeMarks : this.negativeMarks,
      duration : this.duration,
      gradeId : this.gradeId,
      mediumId : this.mediumId,
      sponsorId : sponsorId,
      isCompetitionFree : this.isCompetitionFree,
      cost : this.cost,
      bannerBeforeStart : this.bannerBeforeStart,
      flashscreenImage : this.flashscreenImage,
      bannerAfterSubmit : this.bannerAfterSubmit,
      messageBeforePublishResult : this.messageBeforePublishResult,
      competitionRule : this.competitionRule,
      descriptionUrl : this.descriptionUrl

    }

    

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.createCompetition(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetForm();
            this.alertCCmessage = null;
            this.alertService.success("Competition created successfully");
            this.modalService.dismissAll('Close');
            this.getCompetition();            
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

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        // padTo2Digits(date.getSeconds()),  // 👈️ can also add seconds
      ].join(':')
    );
  }

  editCompetition(iIndex,createacompetitions){
    this.competitionData = this.competitionList[iIndex];
    console.log(this.competitionData);
    this.competitionName = this.competitionData.name;
    this.competitionDescription  = this.competitionData.description;
    this.thumbnail = this.competitionData.thumbnail;
    
    this.bannerBeforeStart = this.competitionData.bannerBeforeStart;
    this.flashscreenImage = this.competitionData.flashscreenImage;
    this.bannerAfterSubmit = this.competitionData.bannerAfterSubmit;
    this.messageBeforePublishResult = this.competitionData.messageBeforePublishResult;
    this.descriptionUrl = this.competitionData.descriptionUrl
    const [date, time] = this.formatDate(new Date(this.competitionData.startTime)).split(' ');
    console.log(date, time);
    
    this.competitionRule = this.competitionData.competitionRule;
    
    this.startDate = date;
    this.startTime = time;
    this.positiveMarks = this.competitionData.positiveMarks;
    this.negativeMarks = this.competitionData.negativeMarks;
    this.duration = this.competitionData.duration;

    this.isCompetitionFree = this.competitionData.isCompetitionFree;
    this.cost = this.competitionData.cost;

    this.gradeId = [];
    this.competitionData.gradeId.forEach(element => {
      this.gradeId.push(element._id)
    });
    this.sponsorId = this.competitionData.sponsorId ? this.competitionData.sponsorId._id : 0;
    this.mediumId = [];
    if(this.competitionData.mediumId){
      this.competitionData.mediumId.forEach(element => {
        this.mediumId.push(element._id)
      });
    }
    
    this.competitionModelHeader = 'Update Competition';
    this.competitionModelBtn = 'Update';
    this.showaddTSModel(createacompetitions);
  }

  updateCompetition(){

    this.alertCCmessage = null;
    if(this.gradeId == 0){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select class" };
      return;
    }

    if(this.mediumId.length == 0){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select medium" };
      return;
    }

    let sponsorId = null;
    if(this.sponsorId != 0){
      sponsorId = this.sponsorId;
      //this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select sponsor" };
      //return;
    }

    if(this.competitionName == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition name" };
      return;
    }

    if(this.competitionDescription == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition description" };
      return;
    }

    if(this.thumbnail == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition thumbnail url" };
      return;
    }

    if(this.startDate == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select competition start Date" };
      return;
    }

    if(this.startTime == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select competition start time" };
      return;
    }

    if(this.positiveMarks == 0){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter positive marks" };
      return;
    }

    if(this.negativeMarks < 0){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter negative marks" };
      return;
    }

    if(this.duration == 0){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter duration" };
      return;
    }

    let startDateTime = new Date(this.startDate+" "+this.startTime);

    if(this.isCompetitionFree == "PAID"){
      if(this.cost == 0){
        this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter cost" };
        return;
      }    
    }

    if(this.bannerBeforeStart == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter banner image(Before Test Start) url" };
      return;
    }

    if(this.flashscreenImage == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter flashscreen url" };
      return;
    }

    if(this.bannerAfterSubmit == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter banner image(After Test Submit) url" };
      return;
    }

    if(this.messageBeforePublishResult == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter message" };
      return;
    }

    if(this.competitionRule == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition rule" };
      return;
    }

    if(this.descriptionUrl == ""){
      this.alertCCmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter competition description url" };
      return;
    }


    let _testObj = {
      name : this.competitionName,
      description : this.competitionDescription,
      thumbnail : this.thumbnail,
      startTime : startDateTime,
      positiveMarks : this.positiveMarks,
      negativeMarks : this.negativeMarks,
      duration : this.duration,
      gradeId : this.gradeId,
      mediumId : this.mediumId,
      sponsorId : sponsorId,
      isCompetitionFree : this.isCompetitionFree,
      cost : this.cost,
      bannerBeforeStart : this.bannerBeforeStart,
      flashscreenImage : this.flashscreenImage,
      bannerAfterSubmit : this.bannerAfterSubmit,
      messageBeforePublishResult : this.messageBeforePublishResult,
      competitionId : this.competitionData._id,
      competitionRule : this.competitionRule,
      descriptionUrl : this.descriptionUrl


    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.updateCompetition(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetForm();
            this.alertService.success("Competition updated successfully");
            this.modalService.dismissAll('Close');
            this.getCompetition();            
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

    this.gradeId = 0;
    this.mediumId = [];
    this.sponsorId = 0;
    this.thumbnail  = '';
    this.bannerBeforeStart  = '';
    this.flashscreenImage  = '';
    this.bannerAfterSubmit  = '';
    this.competitionRule  = '';
    this.descriptionUrl  = '';
    this.startTime  = '';
    this.startDate  = '';
    this.positiveMarks  = 0;
    this.negativeMarks  = 0;
    this.duration = 0;
    this.competitionDescription = "";
    this.competitionName = "";
    this.messageBeforePublishResult = "";
    this.createTestFlag = false;
    this.competitionModelHeader = 'Create a new Competition';
    this.competitionModelBtn = 'Add';
    
  }
  

  deleteCompetition(iIndex){
    var c = confirm("Are you sure you want to delete this competition?");
    if(c){
      this.userService.deleteCompetition({ competitionId : this.competitionList[iIndex]._id }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.competitionList.splice(iIndex,1);
          this.alertService.success("Competition deleted successfully");
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.dtTrigger.next();
            // Call the dtTrigger to rerender again
          });
        }else{
          this.alertService.error(response.responseMessage);
        }       
      },
      error => {
          this.alertService.error(error);
      });
    }
  }

  activateCompetition(iIndex,iContent){
    console.log(this.competitionList[iIndex]);

    if(this.competitionList[iIndex].status != "ACTIVE"){
      this.competitionIndex = iIndex;
      this.competitionData = this.competitionList[iIndex];
      this.competitionAccess = 'ALL_MDM';
      this.bulkuploadschoolUdiseCodeexcelFile =  undefined;
      this.showaddTSModel(iContent);
    }else{
      var c = confirm("Are you sure you want to "+(this.competitionList[iIndex].status == "ACTIVE" ? "block" : "active")+" this competition?");
      if(c){
        this.userService.activateCompetition({ competitionId : this.competitionList[iIndex]._id, status : (this.competitionList[iIndex].status == "ACTIVE" ? "BLOCK" : "ACTIVE") }).subscribe(response => {
  
          console.log(response);  
          if(response.responseCode == 200){
            this.alertService.success("Competition "+(this.competitionList[iIndex].status == "ACTIVE" ? "blocked" : "activated")+" successfully");
            this.competitionList[iIndex].status = (this.competitionList[iIndex].status == "ACTIVE" ? "BLOCK" : "ACTIVE");
          }else{
            this.alertService.error(response.responseMessage);
          }       
        },
        error => {
            this.alertService.error(error);
        });
      }
    }
    
  }

  handleCAFileInput(files: any) {
    this.alertCAmessage = null;
    this.bulkuploadschoolUdiseCodeexcelFile = files.target.files.item(0);
    console.log(files);
  }

  activateCompetitionNewWay(){
    this.alertCAmessage = null;
    if(this.competitionAccess == 'SCHOOL_LEVEL'){
      if(this.bulkuploadschoolUdiseCodeexcelFile == null || this.bulkuploadschoolUdiseCodeexcelFile == undefined){
        this.alertCAmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select file" };
        return;
      }
    }
   

    const formData = new FormData();  
    formData.append('competitionId', this.competitionData._id);  
    formData.append('competitionAccess', this.competitionAccess);  
    formData.append('file', this.bulkuploadschoolUdiseCodeexcelFile); 
    formData.append('status', (this.competitionList[this.competitionIndex].status == "ACTIVE" ? "BLOCK" : "ACTIVE")); 
      
    //console.log(formData);

    this.userService.activateCompetitionByAccess(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.competitionAccess = 'ALL_MDM';
            this.bulkuploadschoolUdiseCodeexcelFile = undefined;
            this.modalService.dismissAll('Close');
            this.alertService.success("Competition activated successfully");
            this.competitionList[this.competitionIndex].status = (this.competitionList[this.competitionIndex].status == "ACTIVE" ? "BLOCK" : "ACTIVE");
            this.competitionList[this.competitionIndex].competitionAccess = response.result.competitionAccess;
            this.competitionList[this.competitionIndex].competitionSchoolAccess = response.result.competitionSchoolAccess;
            
           // this.getTSTests(this.competitionData,null);
          }else{
            this.alertCAmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
            this.createTestFlag = false;
          }       
    },
    error => {
      this.alertCAmessage = { type: 'error', cssClass : 'alert alert-danger', text: error };
    });
    
  }

  bulkUploadSchoolsForCompetitions(){
    this.alertCAmessage = null;
    if(this.bulkuploadschoolUdiseCodeexcelFile == null || this.bulkuploadschoolUdiseCodeexcelFile == undefined){
      this.alertCAmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select file" };
      return;
    }

    const formData = new FormData();  
    formData.append('competitionId', this.competitionData._id);  
    formData.append('file', this.bulkuploadschoolUdiseCodeexcelFile); 
      
    //console.log(formData);
    this.isSchoolListUplading = true;
    this.userService.bulkUploadSchoolsForCompetitions(formData).subscribe((response) => {

          console.log(response);  
          this.isSchoolListUplading = false;
          if(response.responseCode == 200){
            this.bulkuploadschoolUdiseCodeexcelFile = undefined;
            this.alertCAmessage = { type: 'success', cssClass : 'alert alert-success', text: "School added successfully" };
            this.viewSchoolList(this.competitionIndex,null)
           // this.getTSTests(this.competitionData,null);
          }else{
            this.alertCAmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
            this.createTestFlag = false;
          }       
    },
    error => {
      this.isSchoolListUplading = false;
      this.alertCAmessage = { type: 'error', cssClass : 'alert alert-danger', text: error };
    });
    
  }

  removeSchoolFromCompetition(iIndex){
    var c = confirm("Are you sure you want to remove school?");
    if(c){
      this.userService.removeSchoolFromCompetition({ schoolId : this.competitionAccessSchoools[iIndex]._id, competitionId : this.competitionList[this.competitionIndex]._id }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.viewSchoolList(this.competitionIndex,null)
          this.alertService.success("School removed successfully");
        }else{
          this.alertService.error(response.responseMessage);
        }       
      },
      error => {
          this.alertService.error(error);
      });
    }
  }

  // publishResult(iIndex){
  //   var c = confirm("Are you sure you want to publish result?");
  //   if(c){
  //     this.userService.publishResult({ competitionId : this.competitionList[iIndex]._id }).subscribe(response => {

  //       console.log(response);  
  //       if(response.responseCode == 200){
  //         this.competitionList[iIndex].publishResult = "PUBLISH";
  //         this.alertService.success("Result published successfully");
  //       }else{
  //         this.alertService.error(response.responseMessage);
  //       }       
  //     },
  //     error => {
  //         this.alertService.error(error);
  //     });
  //   }
  // }

  publishRank(iIndex){
    var c = confirm("Are you sure you want to publish rank?");
    if(c){
      this.userService.publishRank({ competitionId : this.competitionList[iIndex]._id }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.competitionList[iIndex].publishRank = "PUBLISH";
          this.alertService.success("Rank published successfully");
        }else{
          this.alertService.error(response.responseMessage);
        }       
      },
      error => {
          this.alertService.error(error);
      });
    }
  }


  showCompetitionEnrolllist(iIndex){
    this.router.navigate(['/home/view-competition-enroll-user'], { queryParams: { competitionId:  this.competitionList[iIndex]._id , competitionName : this.competitionList[iIndex].name } });
  }
  
  getCompetitionStudent(iIndex){
    this.router.navigate(['/home/view-competition-response'], { queryParams: { competitionId:  this.competitionList[iIndex]._id, competitionName : this.competitionList[iIndex].name } });
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

  public toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });


  bulkUploadPaper(iIndex,content){

    this.userService.getCompetitionQuestions(this.competitionList[iIndex]._id).subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
              this.competitionIndex = iIndex;
              this.competitionData = this.competitionList[iIndex];
              this.competitionQuestions = response.result;
              this.alertmessage = null;
              //this.alertBUmessage = null;
              if(content){
                this.modalService.open(content, {windowClass : "selectedQuestionModalClass",ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                  let closeResult = `Closed with: ${result}`;
                  console.log("closeResult -- ",closeResult);
                }, (reason) => {
                  let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                  console.log("closeResult -- ",closeResult);
                });
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


  handleBUFileInput(files: any) {
    this.alertBUmessage = null;
    this.bulkuploadexcelFile = files.target.files.item(0);
    console.log(files);
  }

  bulkUploadPaperToServer(){

    this.alertBUmessage = null;
    if(this.bulkuploadexcelFile == null || this.bulkuploadexcelFile == undefined){
      this.alertBUmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select file" };
      return;
    }

    const formData = new FormData();  
    formData.append('competitionId', this.competitionData._id);  
    formData.append('file', this.bulkuploadexcelFile);  
    //console.log(formData);
    this.isQuestionListUplading = true;
    this.userService.bulkuploadCompetitionQuestions(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
          
            this.bulkuploadexcelFile = undefined;
            this.isQuestionListUplading = false;
            if(response.totalCount > 0){
              this.alertBUmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
            }else{
              this.alertBUmessage = { type: 'success', cssClass : 'alert alert-success', text: response.responseMessage };
            }
            
            this.competitionData.questionArray = response.result;
            this.competitionList[this.competitionIndex].questionArray = response.result;
            this.bulkUploadPaper(this.competitionIndex,null);
            //this.closeBUTSPModal();
            
           // this.getTSTests(this.competitionData,null);
          }else{
            this.isQuestionListUplading = false;
            this.alertBUmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
            this.createTestFlag = false;
          }       
    },
    error => {
      this.isQuestionListUplading = false;
      this.alertBUmessage = { type: 'error', cssClass : 'alert alert-danger', text: error };
    });

  }

  private closeBUTSPModal(): void {
    document.getElementById("closeBtn").click();

  }


  deleteQuestion(iQuestionId,iIndex){
    var c = confirm("Are you sure you want to delete this question?");
    if(c){
      this.userService.deleteCompetitionQuestion({ questionId : iQuestionId, competitionId : this.competitionData._id }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.competitionQuestions.splice(iIndex,1);

          for(let i = 0 ; i < this.competitionList.length ; i++){
            if(this.competitionList[i]._id == this.competitionData._id){
                this.competitionList[i].questionArray.splice(iIndex,1);
                break;
            }
          }
          this.alertBUmessage = { type: 'success', cssClass : 'alert alert-success', text: ("Test Questions deleted successfully") };
        }else{
          this.alertBUmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
        }       
      },
      error => {
        this.alertBUmessage = { type: 'error', cssClass : 'alert alert-danger', text: error };
      });
    }
  }

  sendNotificationsModel(iIndex,content){

    this.userService.getCompetitionNotifications(this.competitionList[iIndex]._id).subscribe(response => {
      console.log(response);  
      if(response.responseCode == 200){
          this.competitionNotifications = response.result;
          this.competitionIndex = iIndex;
          this.competitionData = this.competitionList[iIndex];
      
          if(content){
            this.modalService.open(content, {windowClass : "selectedQuestionModalClass",ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
              let closeResult = `Closed with: ${result}`;
              console.log("closeResult -- ",closeResult);
            }, (reason) => {
              let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              console.log("closeResult -- ",closeResult);
            });
          }
          
      }
    });
    

  }

  sendNotificationServer(){

    // if(this.displayTarget == "0"){
    //   this.alertSNmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select display target" };
    //   return;
    // }

    if(this.notificationtitle == ""){
      this.alertSNmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter notification title" };
      return;
    }

    if(this.notificationdescription == ""){
      this.alertSNmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter notification description" };
      return;
    }

    let _testObj = {
      title : this.notificationtitle,
      description : this.notificationdescription,
      displayTarget : this.displayTarget,
      competitionId : this.competitionData._id
    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.sendCompetitionsNotifications(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.alertSNmessage = { type: 'success', cssClass : 'alert alert-success', text: response.responseMessage };
            this.sendNotificationsModel(this.competitionIndex,null);
          }else{
            this.alertSNmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
            this.createTestFlag = false;
          }       
    },
    error => {
      this.alertSNmessage = { type: 'error', cssClass : 'alert alert-danger', text: JSON.stringify(error) };
      this.createTestFlag = false;
    });
  }

  resendNotificationsToCompetitionsStudent(iIndex,iNotification){
    
    console.log(iNotification);

    var c = confirm("Are you sure you want to resend notification again?");
    if(c){
      this.userService.resendNotificationsToCompetitionsStudent({ competitionnotificationsId : iNotification._id, competitionId : iNotification.competitionId._id }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.competitionNotifications[iIndex].noOfTimeNotificationSent = response.result.noOfTimeNotificationSent;
          this.alertSNmessage = { type: 'success', cssClass : 'alert alert-success', text: response.responseMessage };
        }else{
          this.alertSNmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
        }       
      },
      error => {
        this.alertSNmessage = { type: 'error', cssClass : 'alert alert-danger', text: JSON.stringify(error) };
      });
    }
  }


  competitionSettings(iIndex,iContent){
      console.log(this.competitionList[iIndex]);
      this.competitionIndex = iIndex;

      this.publishResult = this.competitionList[iIndex].publishResult == 'PUBLISH' ? true : false;
      this.publishReview = this.competitionList[iIndex].publishReview == 'PUBLISH' ? true : false;
      this.publishCertificate = this.competitionList[iIndex].publishCertificate == 'PUBLISH' ? true : false;
      
      this.competitionData = this.competitionList[iIndex];
      this.showaddCSModel(iContent);
  }


  showaddCSModel(content) {

    this.alertmessage = null;
  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      let closeResult = `Closed with: ${result}`;
      console.log("closeResult -- ",closeResult);
    }, (reason) => {
      let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log("closeResult -- ",closeResult);
    });
  }

  updateCompetitionSettings(){

    let publishResult = "UNPUBLISH";
    if(this.publishResult){
      publishResult = "PUBLISH";
    }

    let publishReview = "UNPUBLISH";
    if(this.publishReview){
      publishReview = "PUBLISH";
    }

    let publishCertificate = "UNPUBLISH";
    if(this.publishCertificate){
      publishCertificate = "PUBLISH";
    }

    

    this.userService.updateCompetitionSettings({ publishResult, publishReview , publishCertificate, competitionId : this.competitionList[this.competitionIndex]._id }).subscribe(response => {

      console.log(response);  
      if(response.responseCode == 200){
        this.competitionList[this.competitionIndex].publishResult = publishResult;
        this.competitionList[this.competitionIndex].publishReview = publishReview;
        this.competitionList[this.competitionIndex].publishCertificate = publishCertificate;
        this.alertService.success("Settings updated successfully");
        this.competitionData = null;
        this.competitionIndex = -1;
        this.alertCSAmessage = null;
        this.modalService.dismissAll('Close');
      }else{
        this.alertService.error(response.responseMessage);
      }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  setCompetitionDataOnForm(){

    this.competitionName = this.competitionIdForm.name;
    this.competitionDescription  = this.competitionIdForm.description;
    this.thumbnail = this.competitionIdForm.thumbnail;
    
    this.bannerBeforeStart = this.competitionIdForm.bannerBeforeStart;
    this.flashscreenImage = this.competitionIdForm.flashscreenImage;
    this.bannerAfterSubmit = this.competitionIdForm.bannerAfterSubmit;
    this.messageBeforePublishResult = this.competitionIdForm.messageBeforePublishResult;
    this.descriptionUrl = this.competitionIdForm.descriptionUrl
    const [date, time] = this.formatDate(new Date(this.competitionIdForm.startTime)).split(' ');
    console.log(date, time);
    
    this.competitionRule = this.competitionIdForm.competitionRule;
    
    this.startDate = date;
    this.startTime = time;
    this.positiveMarks = this.competitionIdForm.positiveMarks;
    this.negativeMarks = this.competitionIdForm.negativeMarks;
    this.duration = this.competitionIdForm.duration;

    this.isCompetitionFree = this.competitionIdForm.isCompetitionFree;
    this.cost = this.competitionIdForm.cost;
    this.sponsorId = this.competitionIdForm.sponsorId ? this.competitionIdForm.sponsorId._id : 0;
    this.competitionIdForm = 0;
    
  }
}

