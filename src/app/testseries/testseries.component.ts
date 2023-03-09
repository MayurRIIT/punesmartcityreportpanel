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
  selector: 'app-testseries',
  templateUrl: './testseries.component.html',
  styleUrls: ['./testseries.component.scss'],
})
export class TestseriesComponent implements OnInit {

 
  testSeriesList : any = [];
  loading : boolean = false;
  alertmessage : any;
  alertBUmessage : any;
  gradeList : any = [];
  gradeId : any = 0;
  mediumsList : any = [];
  mediumId  : any = 0;
  userType : string;

  subjectList : any = [];
  subjectId : any = 0;
  modelBtnTitle : string = "Add";
  bulkuploadexcelFile: any  = null;
  questionPaperFile: any  = null;
  answerKeyFile: any = null;

  TestSeriesName : string = '';
  TestSeriesDescription : string = '';
  IsTSFtee : string = '0';
  freeOnMDMPurchase : string = '0';
  Cost : string = null;
  createTestFlag : boolean = false;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  usersList : any = [];
  testPaperList : any = [];

  editTestPaperIndex : number = 0;
  testSeriesIdData: any = null;
  title = 'datatables';
  dtOptions: DataTables.Settings =  {};
  dtTrigger: Subject<any> = new Subject<any>();

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
    this.getTestSeries();
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

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  resetTSPapaerModel(){
    this.modelBtnTitle="Add";
    this.subjectId = "0";
    this.questionPaperFile = "";
    this.answerKeyFile = "";
    this.getTestSeries();
  }
  
  showaddTSModel(content) {

    this.alertmessage = null;
    this.modelBtnTitle="Add";

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

  getTestSeries(){
    this.loading = true;

    this.userService.getTestSeries(this.userType,localStorage.getItem("id")).subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.testSeriesList = response.result.testSeriesData;
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
        this.loading = false;
        this.alertService.error(error);
    });
  }

  addTest(){


    if(this.gradeId == 0){
      this.alertService.error("Please select class");
      return;
    }

    if(this.mediumId == 0){
      this.alertService.error("Please select medium");
      return;
    }

    if(this.TestSeriesName == ""){
      this.alertService.error("Please enter test series name");
      return;
    }

    if(this.TestSeriesDescription == ""){
      this.alertService.error("Please enter test series description");
      return;
    }

    // if(this.IsTSFtee == "0"){
    //   if(this.Cost == ""){
    //     this.alertService.error("Please enter cost");
    //     return;
    //   }    
    // }

    let _testObj = {
      name : this.TestSeriesName,
      description : this.TestSeriesDescription,
      isTSFtee : this.IsTSFtee,
      freeOnMDMPurchase : this.freeOnMDMPurchase,
      gradeId : this.gradeId._id,
      mediumId : this.mediumId._id,
    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.createTestSeries(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetForm();
            this.alertService.success("Test series created successfully");
            this.modalService.dismissAll('Close');
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.getTestSeries();
              // Call the dtTrigger to rerender again
            });
            
            
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

  editTestSeries(iTestSeriesData,edittestseries){
    this.testSeriesIdData = iTestSeriesData;
    console.log(iTestSeriesData);
    this.TestSeriesName = iTestSeriesData.name;
    this.TestSeriesDescription = iTestSeriesData.description;
    this.IsTSFtee = iTestSeriesData.isTSFtee;
    this.freeOnMDMPurchase = iTestSeriesData.freeOnMDMPurchase;
    this.showaddTSModel(edittestseries);
  }

  updateTestSeries(){

    if(this.TestSeriesName == ""){
      this.alertService.error("Please enter test series name");
      return;
    }

    if(this.TestSeriesDescription == ""){
      this.alertService.error("Please enter test series description");
      return;
    }

    let _testObj = {
      name : this.TestSeriesName,
      description : this.TestSeriesDescription,
      isTSFtee : this.IsTSFtee,
      freeOnMDMPurchase : this.freeOnMDMPurchase,
      testSeriesId : this.testSeriesIdData._id
    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.updateTestSeries(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetForm();
            this.alertService.success("Test series updated successfully");
            this.modalService.dismissAll('Close');
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.getTestSeries();
              // Call the dtTrigger to rerender again
            });
            
            
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
    this.mediumId = 0;
    this.IsTSFtee = "0";
    this.freeOnMDMPurchase = "0";
    this.TestSeriesDescription = "";
    this.TestSeriesName = "";
    this.Cost = "";
    
  }
  

  deleteTestSeries(iTestseriesId,iIndex){
    var c = confirm("Are you sure you want to delete this test series?");
    if(c){
      this.userService.deleteTestSeries({ testseriesId : iTestseriesId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
        //  this.testSeriesList.splice(iIndex,1);
          this.alertService.success("Test series deleted successfully");
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.getTestSeries();
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



  activateTestSeries(iTestSeriesData,iIndex){
    console.log(iTestSeriesData);
    var c = confirm("Are you sure you want to "+(iTestSeriesData.status == "ACTIVE" ? "block" : "active")+" this test series?");
    if(c){
      this.userService.activateTestSeries({ testSeriesId : iTestSeriesData._id, status : (iTestSeriesData.status == "ACTIVE" ? "BLOCK" : "ACTIVE") }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.alertService.success("Test series "+(iTestSeriesData.status == "ACTIVE" ? "blocked" : "activated")+" successfully");
          this.testSeriesList[iIndex].status = (iTestSeriesData.status == "ACTIVE" ? "BLOCK" : "ACTIVE");
        }else{
          this.alertService.error(response.responseMessage);
        }       
      },
      error => {
          this.alertService.error(error);
      });
    }
  }

  
  showTestSeriesEnrolllist(){
    this.router.navigate(['/home/testseries-user'], { queryParams: { testSeriesId: 0, testSeriesName : "All" } });
  }

  loadUserPurchaseDetails(iTestseriesId,iTestSeriesName){
    this.router.navigate(['/home/testseries-user'], { queryParams: { testSeriesId: iTestseriesId, testSeriesName : iTestSeriesName } });
  }
  
  getTestSeriesStudent(iTestseriesId,iGradeId,mediumId){
    this.router.navigate(['/home/view-testseries-response'], { queryParams: { testSeriesId: iTestseriesId , gradeId : iGradeId, mediumId } });
  }

  getTSTests(iTestseriesData,createtestpapers){
    this.getSubjectList(iTestseriesData.gradeId._id,iTestseriesData.mediumId._id);
    this.userService.getTestPaper(iTestseriesData._id,this.userType,localStorage.getItem('id')).subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
           this.testSeriesIdData = iTestseriesData;
           this.testPaperList = response.result.testPaperData;
           if(createtestpapers)
            this.showaddTSModel(createtestpapers);
           
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  handleQPFileInput(files: any) {
    
    this.questionPaperFile = files.target.files.item(0);
    // this.toBase64(fileToUpload).then((res) => {
    //   this.questionPaperFile = res;
    // })

    console.log(files);
  }


  handleApFileInput(files: any) {
    this.answerKeyFile = files.target.files.item(0);
    // this.toBase64(fileToUpload).then((res) => {
    //   this.answerKeyFile = res;
    // })
    console.log(files);
  }

  addTestPaper(){

    console.log(this.questionPaperFile);
    if(this.subjectId == "0"){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select subject" };
      return;
    }

    if(this.questionPaperFile == ""){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger',text: "Please upload question paper" };
      return;
    }
    
    if(this.answerKeyFile == ""){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger',text: "Please upload answer key" };
      return;
    }


    let payLoad = {
      questionPaperFile: this.questionPaperFile,
      answerKeyFile: this.answerKeyFile,
      subjectId: this.subjectId._id,
      subjectName: this.subjectId.name,
      testseriesId: this.testSeriesIdData._id,
      testseriesName: this.testSeriesIdData.name,
    }

    // const uploadData = new FormData();
    // uploadData.append('questionPaperFile', this.questionPaperFile);
    // uploadData.append('answerKeyFile', this.answerKeyFile);
    // uploadData.append('subjectId', this.subjectId._id);
    // uploadData.append('subjectName', this.subjectId.name);
    // uploadData.append('testseriesId', this.testSeriesIdData._id);
    // uploadData.append('testseriesName', this.testSeriesIdData.name);

    console.log(payLoad);
   
    this.createTestFlag = true;
    this.userService.createTestPaper(payLoad).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetTestpaperForm();
            this.alertmessage = { type: 'success',cssClass : 'alert alert-success', text: "Test paper added successfully" };
           
            this.getTSTests(this.testSeriesIdData,null);
            
          }else{
              this.alertmessage = { type: 'error',cssClass : 'alert alert-danger', text: response.responseMessage };
              this.createTestFlag = false;
          }       
    },
    error => {
      this.alertmessage = { type: 'error',cssClass : 'alert alert-danger', text: error };
        this.createTestFlag = false;
    });
    
  }

  updateTestPaper(){

    console.log(this.questionPaperFile);
    if(this.subjectId == "0"){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select subject" };
      return;
    }

    if(this.questionPaperFile == ""){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger',text: "Please upload question paper" };
      return;
    }
    
    if(this.answerKeyFile == ""){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger',text: "Please upload answer key" };
      return;
    }


    let payLoad = {
      questionPaper: this.questionPaperFile,
      answerKey: this.answerKeyFile,
      subjectId: this.subjectId._id,
      testSeriesPaperId : this.testPaperList[this.editTestPaperIndex]._id
    }

    // const uploadData = new FormData();
    // uploadData.append('questionPaperFile', this.questionPaperFile);
    // uploadData.append('answerKeyFile', this.answerKeyFile);
    // uploadData.append('subjectId', this.subjectId._id);
    // uploadData.append('subjectName', this.subjectId.name);
    // uploadData.append('testseriesId', this.testSeriesIdData._id);
    // uploadData.append('testseriesName', this.testSeriesIdData.name);

    console.log(payLoad);
   
    this.createTestFlag = true;
    this.userService.updateTestPaper(payLoad).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetTestpaperForm();
            this.alertmessage = { type: 'success',cssClass : 'alert alert-success', text: "Test paper updated successfully" };
            this.resetTSPapaerModel();
            this.getTSTests(this.testSeriesIdData,null);
          }else{
              this.alertmessage = { type: 'error',cssClass : 'alert alert-danger', text: response.responseMessage };
              this.createTestFlag = false;
          }       
    },
    error => {
      this.alertmessage = { type: 'error',cssClass : 'alert alert-danger', text: error };
        this.createTestFlag = false;
    });
    
  }

  resetTestpaperForm(){

    this.subjectId = "0";
    this.questionPaperFile = "";
    this.answerKeyFile = "";
   
  }


  editTestPaperModel(iTestseriesId,iIndex,content){
    console.log(this.testPaperList[iIndex]);
    this.alertmessage = null;
    this.modelBtnTitle="Update";
    this.editTestPaperIndex = iIndex;
    this.subjectList.forEach(async (data, index) => {
        if(data._id == this.testPaperList[iIndex].subjectId._id){
          this.subjectId = data;
        }
    });
    this.questionPaperFile = this.testPaperList[iIndex].questionPaper;
    this.answerKeyFile = this.testPaperList[iIndex].answerKey;

    
  }


  deleteTestPaper(iTestPaparId,iIndex){
    var c = confirm("Are you sure you want to delete this test paper?");
    if(c){
      this.userService.deleteTestPaper({ testSeriesId : this.testSeriesIdData._id, testPaperId : iTestPaparId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          //  this.testSeriesList.splice(iIndex,1);
          this.alertmessage = { type: 'success',cssClass : 'alert alert-success', text: "Test paper deleted successfully" };
          this.getTSTests(this.testSeriesIdData,null);
        }else{
          this.alertmessage = { type: 'error',cssClass : 'alert alert-danger', text: response.responseMessage };
        }       
      },
      error => {
        this.alertmessage = { type: 'error',cssClass : 'alert alert-danger', text: error };
      });
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

  
  getUserActivationStatus(data){
    let status = "";
    if(data.sponsorId == null || data.sponsorId == undefined){
        if((data.SubscriptionCode == 0 || data.SubscriptionCode == "0") || (data.SubscriptionCode == 1 || data.SubscriptionCode == "1") || (data.SubscriptionCode == 2 || data.SubscriptionCode == "2")){
            status = "TRIAL";
        }else{
            status = "ONLINE PAYMENT";
        }
    }else{
      status = "Coupon ("+data.sponsorId.name+")";
    }
    return status;
  }

  getSubjectList(gradeId,mediumId) {

    this.subjectId = 0;
    this.subjectList = [];
  
    this.userService.getSubjectList(gradeId, mediumId).subscribe(response => {
      console.log(response);
      if (response.responseCode == 200) {
        this.subjectList = response.result;
        console.log("subjct", this.subjectList);
      } else {
        this.alertService.error(response.responseMessage);
      }
    },
      error => {
        this.alertService.error(error);
      });


  }

  public toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });


  bulkUploadPaper(content){
    this.alertmessage = null;
    this.alertBUmessage = null;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      let closeResult = `Closed with: ${result}`;
      console.log("closeResult -- ",closeResult);
    }, (reason) => {
      let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log("closeResult -- ",closeResult);
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
    formData.append('testSeriesId', this.testSeriesIdData._id);  
    formData.append('gradeId', this.testSeriesIdData.gradeId._id);  
    formData.append('mediumId', this.testSeriesIdData.mediumId._id);      
    formData.append('file', this.bulkuploadexcelFile);  
    //console.log(formData);

    this.userService.bulkuploadTestSeriesPaper(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
          
            this.bulkuploadexcelFile = undefined;
            let data = response.result;
            let errorCount = 0;
            let successCount = 0;
            data.forEach(element => {
                if(element.subjectId == null){
                  errorCount++;
                }else{
                  successCount++;
                }
            });

            this.alertmessage = { type: 'success', cssClass : 'alert alert-success', text: (successCount + " paper uploaded successfully. Error in "+errorCount+" paper('s)") };

            this.closeBUTSPModal();
            this.getTSTests(this.testSeriesIdData,null);
          }else{
              this.alertBUmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
              this.createTestFlag = false;
          }       
    },
    error => {
      this.alertBUmessage = { type: 'error', cssClass : 'alert alert-danger', text: error };
    });

  }

  private closeBUTSPModal(): void {
    document.getElementById("closeBtn").click();

  }

}
