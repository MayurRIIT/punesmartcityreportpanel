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
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource,MatTable } from "@angular/material/table";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'app-useregistrationreport',
  templateUrl: './useregistrationreport.component.html',
  styleUrls: ['./useregistrationreport.component.scss'],
})
export class UseregistrationreportComponent implements OnInit {

  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  gradeList : any = [];
  mediumsList : any = [];
  schoolId : any = 0;
  mediumId  : any = 0;

  selectedSchoolId : string = "";
  selectedSchoolName : string = null;

  gradeId : any = 0;
  loading : boolean = false;
  datalist : any = [];
  searchTerm : string = '';
  mobileNumber: string = '';
  selectfromdate : string;
  selecttodate : string;
  viewtype : number=0

  activatedSchoolList : any = [];
  schoolUdiseCode : string = '';

  rolelist : any = [];
  upgradeRoleId : string = "";
  actualRoleId : string = "";
  userType : string = "";
  
  upgradeMediumId : string = "";
  upgradeGradeIds : any = [];
  actualGradeIds : any = [];
  actualMediumId : string = "";

  alertmessage : any;
  alertosmessage : any;
  
  gradeData : any = 0;
  mediumData  : any = 0;
  schoolData : any = 0;

  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();

  districtList : any = [];
  districtId : any = "0";
  address : string = "";
  city : string = "";
  pincode : string = "";
  userId : string = "";
  userIndex : number = -1;
  userCategory : string = "";

  deviceId : string = "";
  deviceIdArr : any = [];

  @ViewChild(MatTable) mattable: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  public dataSource: any = null;
  public displayedColumns: string[] = [
    "Sr no.",
    "userType",
    "Class",
    "Allowed Classes",
    "Medium",
    "School Name",
    "Name of learner",
    "sponsorId",
    "Mobile",
    "Gender",
    "Email",
    "Registered At",
    "Address",
    "Pincode",
    "Payment Status",
    "Landmark City/Village",
    "Action"
  ];
  public pageSize = 10;
  public pageSizeOptions = [10];
  public pageIndex = 1;
  public dataLength = NaN;
  
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
    this.getDistrict();
    this.getRoles();
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

  getDistrict(){
    this.userService.getDistrict().subscribe(response => {
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

  getRoles(){
    this.userService.getAllRoles().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            response.result.map((role) =>{
              if(role.name == 'STUDENT' || role.name == 'TEACHER')
                this.rolelist.push(role);            
            });

            
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

  resetIndex(){
    this.pageSize = 10;
    this.pageIndex = 1;
  }

  loadDashboardData(){

      this.alertService.clear();
    
      if(this.gradeId == 0){
        this.alertService.error("Please select class");
        return;
      }

      // if(this.schoolId == 0){
      //   this.alertService.error("Please select school");
      //   return;
      // }
      console.log(this.gradeId,this.schoolId,this.mediumId)

      let gradeId = 0;
      if(this.gradeId == "0"){
        gradeId = 0;
      }else{
        gradeId = this.gradeId._id;
      }

      let schoolId = this.schoolId;
      // if(this.schoolId == "0"){
      //   schoolId = 0;
      // }else{
      //   schoolId = this.schoolId._id;
      // }

      let mediumId = 0;
      if(this.mediumId == "0"){
        mediumId = 0;
      }else{
        mediumId = this.mediumId._id;
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

      this.mobileNumber = "";
      this.loading = true;
      this.dataSource = null;

      this.userService.getStudentRegistrationReport(gradeId,schoolId,mediumId,this.viewtype,this.selectfromdate,this.selecttodate,this.pageIndex, this.pageSize).subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
                this.datalist = response.result;
                this.gradeData = this.gradeId;
                this.mediumData = this.mediumId;
                this.schoolData = this.schoolId;
                this.loading = false;

                this.dataSource = new MatTableDataSource<any>(this.datalist);
                this.dataLength = response.totalCount;
                this.dataSource.sort = this.sort;
                // if(this.dtElement && this.dtElement.dtInstance){
                //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                //     // Destroy the table first
                //     dtInstance.destroy();
                //     this.dtTrigger.next();
                //     // Call the dtTrigger to rerender again
                //   });
                  
                // }else{
                //   this.dtTrigger.next();
                // }

                
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
  
  seachData(){

      this.alertService.clear();

      //console.log(this.mobileNumber,this.mobileNumber.length)
    
      if(this.mobileNumber == ""){
        this.alertService.error("Please enter mobile number");
        return;
      }


      this.loading = true;
      this.dataSource = null;
      this.userService.searchData(this.mobileNumber,this.pageIndex, this.pageSize).subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
                this.datalist = response.result;
                this.loading = false;
                // if(this.dtElement && this.dtElement.dtInstance){
                //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                //     // Destroy the table first
                //     dtInstance.destroy();
                //     this.dtTrigger.next();
                //     // Call the dtTrigger to rerender again
                //   });
                  
                // }else{
                //   this.dtTrigger.next();
                // }

                this.dataSource = new MatTableDataSource<any>(this.datalist);
                this.dataLength = response.totalCount;
                this.dataSource.sort = this.sort;

                
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

  onEditAddress(iIndex,iData,iModel){
    console.log(iData)
    if(iData.gradeIds){
      iData.gradeIds.map((gradeId) =>{
        this.actualGradeIds.push(gradeId._id);            
        this.upgradeGradeIds.push(gradeId._id);            
      });
    }

    // this.actualGradeIds = iData.gradeIds ?  iData.gradeIds : [];
    // this.upgradeGradeIds = iData.gradeIds ?  iData.gradeIds : [];
    this.actualMediumId = iData.mediumId ?  iData.mediumId._id : "";
    this.upgradeMediumId = iData.mediumId ?  iData.mediumId._id : "";
    
    this.upgradeRoleId = iData.roleId ?  iData.roleId : "";
    this.actualRoleId = iData.roleId ?  iData.roleId : "";

    this.userType = iData.userType ?  iData.userType : "";

    this.districtId = iData.district ?  iData.district._id : "0";
    this.address = iData.address ? iData.address : "";
    this.city = iData.city ? iData.city : ""; 
    this.pincode = iData.pincode ? iData.pincode : ""; 
    this.userId = iData._id;
    this.userIndex = iIndex;
    console.log(this.districtId);

    if(iData.schoolId){
      this.selectedSchoolId = iData.schoolId._id;
      this.selectedSchoolName = iData.schoolId.schoolName+" - "+iData.schoolId.schoolCode;
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

  onUpdateUserCategory(iIndex,iData,iModel){
    console.log(iData)
    this.userCategory = iData.userCategory ?  iData.userCategory : "0";
    this.deviceIdArr = iData.deviceId ?  iData.deviceId : [];
    this.userId = iData._id;
    this.userIndex = iIndex;
    this.openOfflineBModel(iModel);
  }

  openOfflineBModel(content) {

    this.modalService.open(content).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }  

  updateOfflineStudentData(){

    let userObj = { userCategory : this.userCategory, userId  :  this.userId };
    this.userService.updateStudentInformation(userObj).subscribe((response) => {

      console.log(response);  
      if(response.responseCode == 200){
        
        this.datalist[this.userIndex] = response.result;
        this.dataSource = new MatTableDataSource<any>(this.datalist);

        this.userCategory = "0";
        this.userId = "";
        this.userIndex = -1;
        this.alertService.success(response.responseMessage);
        this.modalService.dismissAll('Close');
        
      }else{
        this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
      }       
    },
    error => {
      this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: JSON.stringify(error) };
    });
  }

  updateOfflineStudentDataDeviceId(){

    if(this.deviceId == ""){
      this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter device Id" };
      return;
    }
    
    if(this.deviceIdArr.includes(this.deviceId)){
      this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter add different device Id" };
      return;
    }

    let userObj = { deviceId : this.deviceId, addFlag : true, userId  :  this.userId };
    this.userService.updateStudentdeviceIdData(userObj).subscribe((response) => {

      console.log(response);  
      if(response.responseCode == 200){
        
        this.datalist[this.userIndex] = response.result;
        this.dataSource = new MatTableDataSource<any>(this.datalist);
        this.deviceIdArr = this.datalist[this.userIndex].deviceId;
        this.alertosmessage = { type: 'success', cssClass : 'alert alert-success', text: response.responseMessage };
        this.deviceId = "";
        
      }else{
        this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
      }       
    },
    error => {
      this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: JSON.stringify(error) };
    });
  }


  removeOfflineStudentDataDeviceId(deviceId){
   
    let userObj = { deviceId : deviceId, addFlag : false, userId  :  this.userId };
    this.userService.updateStudentdeviceIdData(userObj).subscribe((response) => {

      console.log(response);  
      if(response.responseCode == 200){
        
        this.deviceId = "";
        this.datalist[this.userIndex] = response.result;
        this.dataSource = new MatTableDataSource<any>(this.datalist);
        this.deviceIdArr = this.datalist[this.userIndex].deviceId;
        this.alertosmessage = { type: 'success', cssClass : 'alert alert-success', text: response.responseMessage };
        
      }else{
        this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
      }       
    },
    error => {
      this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: JSON.stringify(error) };
    });
  }


  updateTokenOfflineStudentData(){

    let userObj = { fcmToken : null, userId  :  this.userId };
    this.userService.updateStudentInformation(userObj).subscribe((response) => {

      console.log(response);  
      if(response.responseCode == 200){
        
        this.datalist[this.userIndex] = response.result;
        this.dataSource = new MatTableDataSource<any>(this.datalist);

        this.userId = "";
        this.userIndex = -1;
        this.alertService.success(response.responseMessage);
        this.modalService.dismissAll('Close');
        
      }else{
        this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: response.responseMessage };
      }       
    },
    error => {
      this.alertosmessage = { type: 'error', cssClass : 'alert alert-danger', text: JSON.stringify(error) };
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

  updateStudentData(){


    // if(this.upgradeGradeIds.length == 0){
    //   this.alertmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select atlist one grade" };
    //   return;
    // }

    // if(this.pincode == ""){
    //   //this.alertService.error("Please enter pincode");
    //   this.alertmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select pincode" };
    //   return;
    // }

    // if(this.city == ""){
    //   //this.alertService.error("Please enter city");
    //   this.alertmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter city" };
    //   return;
    // }

    // if(this.districtId == "0"){
    //   //this.alertService.error("Please select district");
    //   this.alertmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please select district" };
    //   return;
    // }

    // if(this.address == ""){
    //   //this.alertService.error("Please enter address");
    //   this.alertmessage = { type: 'error', cssClass : 'alert alert-danger', text: "Please enter address" };
    //   return;
    // }

    
    let _userObj = {
      
    }

    if(this.datalist[this.userIndex].city  != this.city){
      _userObj = { ..._userObj, ...{ city  :  this.city } };
    }

    if(this.datalist[this.userIndex].city  != this.city){
      _userObj = { ..._userObj, ...{ city  :  this.city } };
    }

    if(this.datalist[this.userIndex].address  != this.address){
      _userObj = { ..._userObj, ...{ address  :  this.address } };
    }

    let districtId = "0";
    if(this.datalist[this.userIndex].district){
      districtId = this.datalist[this.userIndex].district._id;
    }

    console.log(this.selectedSchoolId);
    if(this.selectedSchoolId != ""){
      console.log(this.datalist[this.userIndex].schoolId);
      let schoolId = "0";
      if(this.datalist[this.userIndex].schoolId){
        schoolId = this.datalist[this.userIndex].schoolId._id;
      }

      if(schoolId != this.selectedSchoolId){
        _userObj = { ..._userObj, ...{ schoolId  :  this.selectedSchoolId } };
      }
    }

    
    
    
    // let actualUpgradeGradeIds = [];
    // for(let  i = 0 ; i < this.upgradeGradeIds.length ; i++){
    //   if(this.actualGradeIds.indexOf(this.upgradeGradeIds[i]) == -1){
    //     actualUpgradeGradeIds.push(this.upgradeGradeIds[i]);
    //   }
    // }

    let a = this.actualGradeIds.toString();
    let b = this.upgradeGradeIds.toString();
    let isSame = a===b;
    console.log("isSame --- ",isSame);
    if(!isSame){
      //let completeGradeIds = [...this.actualGradeIds, ...actualUpgradeGradeIds]
      //_userObj = { ..._userObj, ...{ completeGradeIds : completeGradeIds, upgradeGradeIds  :  actualUpgradeGradeIds } };
      
      let completeGradeIds = this.upgradeGradeIds;
      _userObj = { ..._userObj, ...{ completeGradeIds : completeGradeIds  } };

    }

    if(this.actualMediumId != this.upgradeMediumId){
      _userObj = { ..._userObj, ...{ mediumId  :  this.upgradeMediumId } };
    }

    if(this.actualRoleId != this.upgradeRoleId){

      let userType = this.userType;
      for(let  i = 0 ; i < this.rolelist.length ; i++){
        if(this.rolelist[i]._id == this.upgradeRoleId){
          userType = this.rolelist[i].name;
          break;
        }
      }
      _userObj = { ..._userObj, ...{ roleId  :  this.upgradeRoleId, userType } };
    }

    console.log(_userObj);

    if(Object.keys(_userObj).length > 0){
      _userObj = { ..._userObj, ...{ userId  :  this.userId } };

      this.userService.updateStudentInformation(_userObj).subscribe((response) => {

            console.log(response);  
            if(response.responseCode == 200){
              
              this.datalist[this.userIndex] = response.result;
              this.dataSource = new MatTableDataSource<any>(this.datalist);

              this.districtId = "0";
              this.address = "";
              this.city = "";
              this.pincode = "";
              this.userId = "";
              this.userIndex = -1;

              this.upgradeRoleId = "";
              this.actualRoleId = "";
              this.userType = "";

              this.upgradeMediumId = "";
              this.upgradeGradeIds = [];
              this.actualGradeIds = [];
              this.actualMediumId = "";

              this.alertService.success(response.responseMessage);
              this.modalService.dismissAll('Close');
              
            }else{
                this.alertService.error(response.responseMessage);
            }       
      },
      error => {
          this.alertService.error(error);
      });

    }else{
      this.districtId = "0";
      this.address = "";
      this.city = "";
      this.pincode = "";
      this.userId = "";
      this.userIndex = -1;
      this.upgradeRoleId = "";
      this.actualRoleId = "";
      this.userType = "";

      this.upgradeMediumId = "";
      this.upgradeGradeIds = [];
      this.actualGradeIds = [];
      this.actualMediumId = "";
      this.modalService.dismissAll('Close');
    }

    
    
  }


  public getNext(e) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;

    if(this.mobileNumber == ""){
      this.loadDashboardData();
    }else{
      this.seachData();
    }
    
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
    this.alertmessage = null;
    this.activatedSchoolList = [];
    if(this.schoolUdiseCode && this.schoolUdiseCode.length > 8){
      this.userService.searchSchoolbyUdiseCode(this.schoolUdiseCode).subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
              this.activatedSchoolList = response.result;
            }else{
              this.alertmessage = { type: 'error',cssClass : 'alert alert-danger', text: response.responseMessage };

            }       
      },
      error => {
        this.alertmessage = { type: 'error',cssClass : 'alert alert-danger', text: error };
      });
    }else{
      this.alertmessage = { type: 'error',cssClass : 'alert alert-danger', text: "Please enter minimum 8 character of UDISE code to search the school." };
    }
  }

  selectSchool(iIndex){
    this.selectedSchoolId = this.activatedSchoolList[iIndex]._id;
    this.selectedSchoolName = this.activatedSchoolList[iIndex].schoolName+" - "+this.activatedSchoolList[iIndex].schoolCode;
    this.activatedSchoolList = [];
    this.schoolUdiseCode = "";
  }

  clearSchool(){
    this.selectedSchoolId = "";
    this.selectedSchoolName = null;
  }

}
