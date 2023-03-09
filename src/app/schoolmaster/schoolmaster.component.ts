import { Component, OnInit,ViewChild } from '@angular/core';
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
  selector: 'app-schoolmaster',
  templateUrl: './schoolmaster.component.html',
  styleUrls: ['./schoolmaster.component.scss'],
})
export class SchoolmasterComponent implements OnInit {


  schoolList : any = [];
  activatedSchoolList : any = [];
  schoolUdiseCode : string = '';
  loading : boolean = false;
  alertmessage : any;
  searchschoolalertmessage : any;
  gradeList : any = [];
  gradeId : any = 0;
  mediumsList : any = [];
  mediumId  : any = 0;
  schoolMediumId  : any =[] ;
  schoolpopupheading = "Create a new School";

  districtId :  any = 0;
  districtList : any = [];
  schoolTitle : string = '';
  schoolCode : string = '';
  address : string = '';
  email : string ;
  password : string ;
  mobile : string ;

  taluka : string = '';
  village : string = '';
  pincode : string = '';
  schoolManagement : string = '';
  center : string = '';
  schoolType : string = '';

  isStudentSchoolUplading : boolean = false;
  bulkuploadexcelFile: any  = null;
  alertBUSSmessage : any;

  createTestFlag : boolean = false;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  usersList : any = [];
  divisionsList : any = [];
  editschoolId :  string = null;
  divisionName : string = '';
  schoolId: string = null;
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
    this.getDistrictList();
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



  getDistrictList(){
    this.userService.getDistrictList().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.districtList = response.result;
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  getSchoolList(){
    this.loading = true;
    this.userService.getQBSchoolList().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.schoolList = response.result;
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
            this.loading = false;
            this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.loading = false;
        this.alertService.error(error);
    });
  }

  

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  showaddSchoolModel(content) {


    this.modalService.open(content, { windowClass : "selectedQuestionModalClass", ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      let closeResult = `Closed with: ${result}`;
      console.log("closeResult -- ",closeResult);
    }, (reason) => {
      let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log("closeResult -- ",closeResult);
    });
  }

  showaddBUSSModel(content) {


    this.modalService.open(content, {  ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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


  addTest(){

    if(this.schoolTitle == ""){
      this.alertService.error("Please enter school title");
      return;
    }

    if(this.schoolCode == ""){
      this.alertService.error("Please enter school code");
      return;
    }

    // if(this.schoolMediumId.length == 0 ){
    //   this.alertService.error("Please select medium");
    //   return;
    // }

    // if(this.mobile == ""){
    //   this.alertService.error("Please enter mobile");
    //   return;
    // }

    // if(this.email == ""){
    //   this.alertService.error("Please enter email");
    //   return;
    // }

    if(this.address == ""){
      this.alertService.error("Please enter address");
      return;
    }

    // if(this.password == ""){
    //   this.alertService.error("Please enter password");
    //   return;
    // }

    if(this.districtId == 0){
      this.alertService.error("Please select district");
      return;
    }

    if(this.taluka == ""){
      this.alertService.error("Please enter taluka");
      return;
    }

    if(this.village == ""){
      this.alertService.error("Please enter village");
      return;
    }
    if(this.village == ""){
      this.alertService.error("Please enter village");
      return;
    }
    if(this.pincode == ""){
      this.alertService.error("Please enter pincode");
      return;
    }
    if(this.schoolManagement == ""){
      this.alertService.error("Please enter school management");
      return;
    }
    if(this.center == ""){
      this.alertService.error("Please enter village");
      return;
    }
    if(this.schoolType == ""){
      this.alertService.error("Please enter school type");
      return;
    }

    let _testObj = {
      district : this.districtId,
      mediumIds : this.schoolMediumId,
      schoolCode : this.schoolCode,
      schoolName : this.schoolTitle,
      schoolVerified : true,
      taluka : this.taluka,
      village : this.village,
      pincode : this.pincode,
      schoolManagement : this.schoolManagement,
      center : this.center,
      schoolType : this.schoolType,
     // password : this.password,
      address : this.address,
    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.createSchool(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetForm();
            this.alertService.success("School created successfully");
            this.modalService.dismissAll('Close');
            this.getSchoolList();
            
            
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

    this.schoolpopupheading = "Create a new School";
    this.districtId = 0;
    this.schoolTitle = "";
    this.schoolCode = "";
    this.email = "";
    this.mobile = "";
    this.password = "";
    this.address = "";

    this.taluka = "";
    this.village = "";
    this.pincode = "";
    this.schoolManagement = "";
    this.center = "";
    this.schoolType = "";
    
  }

  editSchool(iSchoolData,createaschool){
    console.log(iSchoolData);
    this.districtId = iSchoolData.district._id;
    this.schoolMediumId = [];
    // if(iSchoolData.mediumIds){
    //   iSchoolData.mediumIds.map(medium => {
    //     this.schoolMediumId.push(medium._id)
    //   });
    // }
    
    this.editschoolId = iSchoolData._id;
    this.schoolpopupheading = "Edit School Details - "+iSchoolData.schoolName;

    this.schoolTitle = iSchoolData.schoolName;
    this.schoolCode = iSchoolData.schoolCode;
    this.email = "";
    this.mobile = "";
    this.password = "";
    this.address = iSchoolData.address;
    this.taluka = iSchoolData.taluka;
    this.village = iSchoolData.village;
    this.pincode = iSchoolData.pincode;
    this.schoolManagement = iSchoolData.schoolManagement;
    this.center = iSchoolData.center;
    this.schoolType = iSchoolData.schoolType;
    this.showaddSchoolModel(createaschool);

  }

  updateSchool(){

    if(this.schoolTitle == ""){
      this.alertService.error("Please enter school title");
      return;
    }

    if(this.schoolCode == ""){
      this.alertService.error("Please school code");
      return;
    }

    // if(this.mobile == ""){
    //   this.alertService.error("Please enter mobile");
    //   return;
    // }

    // if(this.email == ""){
    //   this.alertService.error("Please enter email");
    //   return;
    // }

    if(this.address == ""){
      this.alertService.error("Please enter address");
      return;
    }

    // if(this.password == ""){
    //   this.alertService.error("Please enter password");
    //   return;
    // }

    if(this.districtId == 0){
      this.alertService.error("Please select district");
      return;
    }

    if(this.taluka == ""){
      this.alertService.error("Please enter taluka");
      return;
    }

    if(this.village == ""){
      this.alertService.error("Please enter village");
      return;
    }
    if(this.village == ""){
      this.alertService.error("Please enter village");
      return;
    }
    if(this.pincode == ""){
      this.alertService.error("Please enter pincode");
      return;
    }
    if(this.schoolManagement == ""){
      this.alertService.error("Please enter school management");
      return;
    }
    if(this.center == ""){
      this.alertService.error("Please enter village");
      return;
    }
    if(this.schoolType == ""){
      this.alertService.error("Please enter school type");
      return;
    }

    let _testObj = {
      district : this.districtId,
      mediumIds : this.schoolMediumId,
      schoolCode : this.schoolCode,
      schoolName : this.schoolTitle,
      schoolId : this.editschoolId,
      // email : this.email,
      // mobile : this.mobile,
     // password : this.password,
      address : this.address,
      
      taluka : this.taluka,
      village : this.village,
      pincode : this.pincode,
      schoolManagement : this.schoolManagement,
      center : this.center,
      schoolType : this.schoolType,
    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.updateSchool(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetForm();
            this.alertService.success("School details updated successfully");
            this.modalService.dismissAll('Close');
            this.getSchoolList();
            
            
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

  

  deleteTest(iSchoolId,iIndex){
    var c = confirm("Are you sure you want to delete this school?");
    if(c){
      this.userService.deleteschool({ schoolId : iSchoolId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
        //  this.schoolList.splice(iIndex,1);
          this.alertService.success("School deleted successfully");
          this.getSchoolList();
        }else{
          this.alertService.error(response.responseMessage);
        }       
      },
      error => {
          this.alertService.error(error);
      });
    }
  }



  activateTest(iSchoolData,iIndex){
    var c = confirm("Are you sure you want to "+(iSchoolData.status == "ACTIVE" ? "block" : "active")+" this school?");
    if(c){
      this.userService.activateschool({ schoolId : iSchoolData._id, status : (iSchoolData.status == "ACTIVE" ? "BLOCK" : "ACTIVE") }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.alertService.success("School "+(iSchoolData.status == "ACTIVE" ? "blocked" : "activated")+" successfully");
          this.schoolList[iIndex].status = (iSchoolData.status == "ACTIVE" ? "BLOCK" : "ACTIVE");
        }else{
          this.alertService.error(response.responseMessage);
        }       
      },
      error => {
          this.alertService.error(error);
      });
    }
  }

  
  getSchoolStudent(iSchoolId,schoolstudents){
    this.userService.getschoolstudent(iSchoolId).subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
           this.usersList = response.result.userData;
           this.showaddSchoolModel(schoolstudents);
           
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  getSchoolDivisions(iSchoolId,schooldivision){
    this.userService.getSchoolDivisions(iSchoolId).subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
           this.schoolId = iSchoolId;
           this.divisionsList = response.result.divisionData;
           if(schooldivision)
            this.showaddSchoolModel(schooldivision);
           
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  addDivision(){

    if(this.gradeId == "0"){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select class" };
      return;
    }

    if(this.mediumId == "0"){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger',text: "Please select medium" };
      return;
    }
    
    if(this.schoolId == null){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger',text: "School selection error" };
      return;
    }

    if(this.divisionName == ""){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger',text: "Please enter division name" };
      return;
    }


    let _testObj = {
      divisionName : this.divisionName,
      gradeId : this.gradeId,
      mediumId : this.mediumId,
      schoolId : this.schoolId,
    }

    console.log(_testObj);

    this.createTestFlag = true;
    this.userService.createDivision(_testObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetDivisionForm();
            this.alertmessage = { type: 'success',cssClass : 'alert alert-success', text: "School division added successfully" };
           
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.getSchoolDivisions(this.schoolId,null);
              // Call the dtTrigger to rerender again
            });
            
            
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

  resetDivisionForm(){

    this.gradeId = 0;
    this.mediumId = 0;
    this.divisionName = "";
   
  }


  deleteDivision(iDivisionId,iIndex){
    var c = confirm("Are you sure you want to delete this division?");
    if(c){
      this.userService.deleteDivision({ divisionId : iDivisionId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          //  this.schoolList.splice(iIndex,1);
          this.alertmessage = { type: 'success',cssClass : 'alert alert-success', text: "Division deleted successfully" };
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.getSchoolDivisions(this.schoolId,null);
            // Call the dtTrigger to rerender again
          });
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

  searchSchool(){
    this.searchschoolalertmessage = null;
    this.activatedSchoolList = [];
    if(this.schoolUdiseCode && this.schoolUdiseCode.length > 8){
      this.userService.searchSchoolbyUdiseCode(this.schoolUdiseCode).subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
              this.activatedSchoolList = response.result;
            }else{
              this.searchschoolalertmessage = { type: 'error',cssClass : 'alert alert-danger', text: response.responseMessage };

            }       
      },
      error => {
        this.searchschoolalertmessage = { type: 'error',cssClass : 'alert alert-danger', text: error };
      });
    }else{
      this.searchschoolalertmessage = { type: 'error',cssClass : 'alert alert-danger', text: "Please enter minimum 8 character of UDISE code to search the school." };
    }
  }

  activateSchool(iSchoolId,iIndex,status){
    var c = confirm(`Are you sure you want to ${status == 'ACTIVATE' ? 'activate' : 'deactivate'} this school?`);
    if(c){
      this.userService.activateVerifySchool({ schoolId : iSchoolId, schoolVerified : (status == 'ACTIVATE' ? true : false) }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          //  this.schoolList.splice(iIndex,1);
          this.searchschoolalertmessage = { type: 'success',cssClass : 'alert alert-success', text: `school ${status == 'ACTIVATE' ? 'activated' : 'deactivated'} successfully` };
          this.activatedSchoolList[iIndex].schoolVerified = (status == 'ACTIVATE' ? true : false);
          this.getSchoolList();
        }else{
          this.searchschoolalertmessage = { type: 'error',cssClass : 'alert alert-danger', text: response.responseMessage };
        }       
      },
      error => {
        this.searchschoolalertmessage = { type: 'error',cssClass : 'alert alert-danger', text: error };
      });
    }
  }


  handleBUFileInput(files: any) {
    this.alertBUSSmessage = null;
    this.bulkuploadexcelFile = files.target.files.item(0);
    console.log(files);
  }

  bulkUploadPaperToServer(){

    this.alertBUSSmessage = null;
    if(this.bulkuploadexcelFile == null || this.bulkuploadexcelFile == undefined){
      this.alertBUSSmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select file" };
      return;
    }

    const formData = new FormData();  
    formData.append('file', this.bulkuploadexcelFile);  
    //console.log(formData);
    this.isStudentSchoolUplading = true;
    this.userService.bulkuploadSchoolStudentLinkup(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
          
            this.bulkuploadexcelFile = undefined;
            this.isStudentSchoolUplading = false;
            if(response.totalCount > 0){
              this.alertService.error(response.responseMessage);
            }else{
              this.alertService.success(response.responseMessage);
            }
            
            this.modalService.dismissAll('Close');
          }else{
            this.isStudentSchoolUplading = false;
            this.alertBUSSmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
            this.createTestFlag = false;
          }       
    },
    error => {
      this.isStudentSchoolUplading = false;
      this.alertBUSSmessage = { type: 'error', cssClass : 'alert alert-danger', text: error };
    });

  }

}
