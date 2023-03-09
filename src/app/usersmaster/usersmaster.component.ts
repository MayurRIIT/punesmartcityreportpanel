import { Component, OnInit,ViewChild } from '@angular/core';
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
  selector: 'app-usersmaster',
  templateUrl: './usersmaster.component.html',
  styleUrls: ['./usersmaster.component.scss'],
})
export class UsersmasterComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  schoolList: any = [];
  gradeList: any = [];
  mediumsList: any = [];
  schoolId: any = 0;
  mediumId: any = 0;
  gradeId: any = 0;


  districtId :  any = 0;
  districtList : any = [];
  
  rolelist : any = [];
  roleId : any = 0;
  roleIdForm : any = 0;
  datalist : any = [];
  userId : any = 0;

  moduleselected : string = "";
  loading : boolean = false;

  firstName : string = "";
  lastName : string = "";
  password : string = "";
  email : string = "";
  mobileNumber : string = "";
  sponsorId : any = 0;
  sponsorList : any = [];
  selectfromdate : string;
  selecttodate : string;
  viewtype : number=0

  title = 'datatables';
  dtOptions: any =  {};
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

    if(localStorage.getItem("sidemenuname"))
      this.moduleselected = localStorage.getItem("sidemenuname");

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
          'excel'
      ]
    };

    this.getRoles();
    // this.getGrade();
    // this.getMediumsList();
    this.getSchoolList();
    this.getSponsor();
    this.getDistrictList();
  }

  getGrade() {
    this.userService.getGrade1().subscribe(response => {
      console.log(response);
      if (response.responseCode == 200) {
        this.gradeList = response.result;
      } else {
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
  
  getSchoolList() {
    let obj = {
      
    }
      
    this.userService.getSchoolListByDistrict(obj).subscribe((response : any) => {
      console.log(response);
      if (response.responseCode == 200) {
        this.schoolList = response.result;
      } else {
        this.alertService.error(response.responseMessage);
      }
    },
      error => {
        this.alertService.error(error);
      });
  }

  getMediumsList() {
    this.userService.getMediumsList1().subscribe(response => {
      console.log(response);
      if (response.responseCode == 200) {
        this.mediumsList = response.result;
      } else {
        this.alertService.error(response.responseMessage);
      }
    },
      error => {
        this.alertService.error(error);
      });
  }


  getRoles(){
    this.userService.getRoles().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.rolelist = response.result;            
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }


  loadDashboardData(){

      this.alertService.clear();
  
       if(this.roleId == 0){
        this.alertService.error("Please select role");
        return;
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

      let roleId = 0;
      if(this.roleId == "0"){
        roleId = 0;
      }else{
        roleId = this.roleId._id;
      }

      console.log(this.roleId);
      this.loading = true;
      this.userService.getUsers(roleId,this.viewtype,this.selectfromdate,this.selecttodate).subscribe(response => {
        console.log(response);  
        this.loading = false;
        if(response.responseCode == 200){
            this.datalist = response.result;
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
        }       
      },
      error => {
          this.loading = false;
          this.alertService.error(error);
      });
  }

  addUser(iModel){
    this.resetField();
    
    switch(this.roleIdForm.name){
        case 'SCHOOL' : break;
        case 'PRINCIPAL' : break;
        case 'CONTENTMANAGER' :   break;
        case 'SPONSOR' :  break;
    }
    

    this.openBModel(iModel);
  }


  closeModel(){
    this.modalService.dismissAll('Close');
  }
  openBModel(content) {


    this.modalService.open(content, { windowClass : "selectedQuestionModalClass", ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(`Closed with: ${result}`);
      this.resetField();
    }, (reason) => {
      this.resetField();
    });
  }

  resetField(){
    this.roleIdForm = 0;
    this.sponsorId = 0;
    this.schoolId = 0;
    this.firstName = "";
    this.lastName = "";
    this.password = "";
    this.email = "";
    this.mobileNumber = "";
    this.districtId = 0;

  }


  saveUser(){
    
    if(this.roleIdForm == "0"){
      this.alertService.error("Please select role");
      return;
    }

    switch(this.roleIdForm.name){
      case 'SCHOOL' : 
        if(this.schoolId == "0"){
          this.alertService.error("Please select school");
          return;
        }
        break;
      case 'PRINCIPAL' : 
        if(this.schoolId == "0"){
          this.alertService.error("Please select school");
          return;
        }
        break;
      case 'CONTENTMANAGER' :   break;
      case 'SPONSOR' : 
        if(this.sponsorId == "0"){
          this.alertService.error("Please select sponsor");
          return;
        }
        break;
      case 'DISTRICTADMIN' : 
        if(this.districtId == "0"){
          this.alertService.error("Please select district");
          return;
        }      
        break;
  }

    


    if(this.firstName == ""){
      this.alertService.error("Please enter first name");
      return;
    }

    if(this.lastName == ""){
      this.alertService.error("Please enter last name");
      return;
    }

    if(this.email == ""){
      this.alertService.error("Please enter email");
      return;
    }

    if(this.mobileNumber == ""){
      this.alertService.error("Please enter mobile number");
      return;
    }

    if(this.password == ""){
      this.alertService.error("Please enter password");
      return;
    }

    console.log(this.sponsorId ,this.schoolId )

    let obj = {
      roleId : this.roleIdForm._id,
      firstName : this.firstName,
      lastName : this.lastName,
      email : this.email,
      mobileNumber : this.mobileNumber,
      profilePic : 'https://res.cloudinary.com/smsit/image/upload/v1597335652/fmcvdi2g6ogd5vwzvzfa.jpg',
      loginType : 'normal',
      userType : this.roleIdForm.name,
      mobileVerified : true,
      status : "ACTIVE",
      countryCode : "+91",
      password : this.password,
      sponsorId : this.sponsorId == '0' ?  null : this.sponsorId._id,
      schoolId : this.schoolId == '0' ? null : this.schoolId._id,
      schoolVerified : this.schoolId == '0' ? false : true,
      district : this.districtId == '0' ? null : this.districtId,
    }
    console.log(obj);

    this.userService.saveUser(obj).subscribe(response => {
      console.log(response);  
      this.closeModel();
      if(response.responseCode == 200){
          this.loadDashboardData();
      }else{
          this.alertService.error(response.responseMessage);
      }       
    },
    error => {
      this.closeModel();
      this.alertService.error(error);
    });

  }

  onChangeEmail(){
    if(this.email == ""){
      this.alertService.error("Please enter email");
      return;
    }

    this.userService.checkEmailAlreadyExist(this.email).subscribe(response => {
      console.log(response);  
      if(response.responseCode == 200){
        this.email = "";
        alert("Email Id already exist");
      }       
    },
    error => {
        this.alertService.error(error);
    });

  }
  
  onChangeMobileNo(){
    if(this.mobileNumber == ""){
      this.alertService.error("Please enter mobile number");
      return;
    }

    this.userService.checkMobileNumberAlreadyExist(this.mobileNumber).subscribe(response => {
      console.log(response);  
      if(response.responseCode == 200){
        this.mobileNumber = "";
        alert("Mobile number already exist");
      }     
    },
    error => {
        this.alertService.error(error);
    });

  }


  deleteUser(iUserId,iIndex){
    var c = confirm("Are you sure you want to delete this user?");
    if(c){
      this.userService.deleteUser({ userId : iUserId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
        //  this.testSeriesList.splice(iIndex,1);
          this.alertService.success("User deleted successfully");
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.datalist.splice(iIndex,1);
            this.dtTrigger.next();
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



  editUser(iUserId,iIndex){
   
  }



  activateUser(iUserData,iIndex){
    console.log(iUserData);
    var c = confirm("Are you sure you want to "+(iUserData.status == "ACTIVE" ? "block" : "active")+" this user?");
    if(c){
      this.userService.activateUser({ userId : iUserData._id, status : (iUserData.status == "ACTIVE" ? "BLOCK" : "ACTIVE") }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.alertService.success("User "+(iUserData.status == "ACTIVE" ? "blocked" : "activated")+" successfully");
          this.datalist[iIndex].status = (iUserData.status == "ACTIVE" ? "BLOCK" : "ACTIVE");
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
