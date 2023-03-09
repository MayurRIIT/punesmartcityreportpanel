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
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss'],
})
export class ScholarshipComponent implements OnInit {

 
  scholarshipList : any = [];
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

  scholarshipName : string = '';
  scholarshipDescription : string = '';
  IsTSFtee : string = '0';
  freeOnMDMPurchase : string = '0';
  Cost : string = null;
  createTestFlag : boolean = false;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  usersList : any = [];
  testPaperList : any = [];

  editTestPaperIndex : number = 0;
  scholarshipIdData: any = null;
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
    this.getscholarship();
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
    this.getscholarship();
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

  getscholarship(){
    this.loading = true;

    this.userService.getscholarship(this.userType,localStorage.getItem("id")).subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.scholarshipList = response.result.scholarshipData;
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

    if(this.scholarshipName == ""){
      this.alertService.error("Please enter test series name");
      return;
    }

    if(this.scholarshipDescription == ""){
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
      name : this.scholarshipName,
      description : this.scholarshipDescription,
      isTSFtee : this.IsTSFtee,
      freeOnMDMPurchase : this.freeOnMDMPurchase,
      gradeId : this.gradeId._id,
      mediumId : this.mediumId._id,
    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.createscholarship(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetForm();
            this.alertService.success("Test series created successfully");
            this.modalService.dismissAll('Close');
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.getscholarship();
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

  editscholarship(ischolarshipData,editscholarship){
    this.scholarshipIdData = ischolarshipData;
    console.log(ischolarshipData);
    this.scholarshipName = ischolarshipData.name;
    this.scholarshipDescription = ischolarshipData.description;
    this.IsTSFtee = ischolarshipData.isTSFtee;
    this.freeOnMDMPurchase = ischolarshipData.freeOnMDMPurchase;
    this.showaddTSModel(editscholarship);
  }

  updatescholarship(){

    if(this.scholarshipName == ""){
      this.alertService.error("Please enter test series name");
      return;
    }

    if(this.scholarshipDescription == ""){
      this.alertService.error("Please enter test series description");
      return;
    }

    let _testObj = {
      name : this.scholarshipName,
      description : this.scholarshipDescription,
      isTSFtee : this.IsTSFtee,
      freeOnMDMPurchase : this.freeOnMDMPurchase,
      scholarshipId : this.scholarshipIdData._id
    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.updatescholarship(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetForm();
            this.alertService.success("Test series updated successfully");
            this.modalService.dismissAll('Close');
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.getscholarship();
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
    this.scholarshipDescription = "";
    this.scholarshipName = "";
    this.Cost = "";
    
  }
  

  deletescholarship(ischolarshipId,iIndex){
    var c = confirm("Are you sure you want to delete this test series?");
    if(c){
      this.userService.deletescholarship({ scholarshipId : ischolarshipId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
        //  this.scholarshipList.splice(iIndex,1);
          this.alertService.success("Test series deleted successfully");
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.getscholarship();
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



  activatescholarship(ischolarshipData,iIndex){
    console.log(ischolarshipData);
    var c = confirm("Are you sure you want to "+(ischolarshipData.status == "ACTIVE" ? "block" : "active")+" this test series?");
    if(c){
      this.userService.activatescholarship({ scholarshipId : ischolarshipData._id, status : (ischolarshipData.status == "ACTIVE" ? "BLOCK" : "ACTIVE") }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.alertService.success("Test series "+(ischolarshipData.status == "ACTIVE" ? "blocked" : "activated")+" successfully");
          this.scholarshipList[iIndex].status = (ischolarshipData.status == "ACTIVE" ? "BLOCK" : "ACTIVE");
        }else{
          this.alertService.error(response.responseMessage);
        }       
      },
      error => {
          this.alertService.error(error);
      });
    }
  }

  
  showscholarshipEnrolllist(){
    this.router.navigate(['/home/scholarship-user'], { queryParams: { scholarshipId: 0, scholarshipName : "All" } });
  }

  loadUserPurchaseDetails(ischolarshipId,ischolarshipName){
    this.router.navigate(['/home/scholarship-user'], { queryParams: { scholarshipId: ischolarshipId, scholarshipName : ischolarshipName } });
  }
  
  getscholarshipStudent(ischolarshipId,iGradeId,mediumId){
    this.router.navigate(['/home/view-scholarship-response'], { queryParams: { scholarshipId: ischolarshipId , gradeId : iGradeId, mediumId } });
  }

  getTSTests(ischolarshipData,createtestpapers){
    this.getSubjectList(ischolarshipData.gradeId._id,ischolarshipData.mediumId._id);
    this.userService.getTestPaperscholarship(ischolarshipData._id,this.userType,localStorage.getItem('id')).subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
           this.scholarshipIdData = ischolarshipData;
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
      scholarshipId: this.scholarshipIdData._id,
      scholarshipName: this.scholarshipIdData.name,
    }

    // const uploadData = new FormData();
    // uploadData.append('questionPaperFile', this.questionPaperFile);
    // uploadData.append('answerKeyFile', this.answerKeyFile);
    // uploadData.append('subjectId', this.subjectId._id);
    // uploadData.append('subjectName', this.subjectId.name);
    // uploadData.append('scholarshipId', this.scholarshipIdData._id);
    // uploadData.append('scholarshipName', this.scholarshipIdData.name);

    console.log(payLoad);
   
    this.createTestFlag = true;
    this.userService.createTestPaperscholarship(payLoad).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetTestpaperForm();
            this.alertmessage = { type: 'success',cssClass : 'alert alert-success', text: "Test paper added successfully" };
           
            this.getTSTests(this.scholarshipIdData,null);
            
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
      scholarshipPaperId : this.testPaperList[this.editTestPaperIndex]._id
    }

    // const uploadData = new FormData();
    // uploadData.append('questionPaperFile', this.questionPaperFile);
    // uploadData.append('answerKeyFile', this.answerKeyFile);
    // uploadData.append('subjectId', this.subjectId._id);
    // uploadData.append('subjectName', this.subjectId.name);
    // uploadData.append('scholarshipId', this.scholarshipIdData._id);
    // uploadData.append('scholarshipName', this.scholarshipIdData.name);

    console.log(payLoad);
   
    this.createTestFlag = true;
    this.userService.updateTestPaperscholarship(payLoad).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetTestpaperForm();
            this.alertmessage = { type: 'success',cssClass : 'alert alert-success', text: "Test paper updated successfully" };
            this.resetTSPapaerModel();
            this.getTSTests(this.scholarshipIdData,null);
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


  editTestPaperModel(ischolarshipId,iIndex,content){
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
      this.userService.deleteTestPaperscholarship({ scholarshipId : this.scholarshipIdData._id, testPaperId : iTestPaparId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          //  this.scholarshipList.splice(iIndex,1);
          this.alertmessage = { type: 'success',cssClass : 'alert alert-success', text: "Test paper deleted successfully" };
          this.getTSTests(this.scholarshipIdData,null);
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
  
    this.userService.getscholarshipSubject(gradeId, mediumId).subscribe(response => {
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
    formData.append('scholarshipId', this.scholarshipIdData._id);  
    formData.append('gradeId', this.scholarshipIdData.gradeId._id);  
    formData.append('mediumId', this.scholarshipIdData.mediumId._id);      
    formData.append('file', this.bulkuploadexcelFile);  
    //console.log(formData);

    this.userService.bulkuploadscholarshipPaper(formData).subscribe((response) => {

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
            this.getTSTests(this.scholarshipIdData,null);
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
