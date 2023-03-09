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
  selector: 'app-teacher-manage',
  templateUrl: './teacher-manage.component.html',
  styleUrls: ['./teacher-manage.component.scss'],
})
export class TeacherManageComponent implements OnInit {

  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  schoolList : any = [];
  gradeList : any = [];
  mediumsList : any = [];
  schoolId : any = 0;
  mediumId  : any = 0;
  gradeId : any = 0;
  loading : boolean = false;
  datalist : any = [];
  userType : string = "TEACHER";
  searchTerm : string = '';
    
  zoomAPIKey : string = '';
  zoomAPISecret : string = '';
  selectedTeacher : any ;

  gradeData : any = 0;
  mediumData  : any = 0;
  schoolData : any = 0;

  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private modalService: NgbModal,
      private authenticationService: AuthenticationService,
      private userService : UserService,
      private alertService: AlertService,
      private excelService:ExcelService
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
    this.getSchoolList();
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

  getSchoolList(){
      this.userService.getQBSchoolList().subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
              //this.schoolList = response.result;
              if(localStorage.getItem("userType") == "SCHOOL" || localStorage.getItem("userType") == "PRINCIPAL" || localStorage.getItem("userType") == "TEACHER"){

                for(let data of response.result) {
                  if(data._id == localStorage.getItem("schoolId")){
                    this.schoolList.push(data);
                    this.schoolId = data._id;
                    break;
                  }
                }
              }else{
                this.schoolList = response.result;
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

  loadDashboardData(){

      this.alertService.clear();
    
      // if(this.gradeId == 0){
      //   this.alertService.error("Please select class");
      //   return;
      // }

      if(this.schoolId == 0){
        this.alertService.error("Please select school");
        return;
      }
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

      
      this.loading = true;
      this.userService.getSchoolUsers(gradeId,schoolId,mediumId,this.userType).subscribe(response => {
            console.log(response);  
            if(response.responseCode == 200){
                this.datalist = response.result;
                this.gradeData = this.gradeId;
                this.mediumData = this.mediumId;
                this.schoolData = this.schoolId;
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


  updateZoomDetails(data,updatezoomdetailsmodel){
      console.log(data);
      this.zoomAPIKey= '';
      this.zoomAPISecret= '';
      if(data.zoomAPIKey){
        this.zoomAPIKey = data.zoomAPIKey;
      }

      if(data.zoomAPISecret){
        this.zoomAPISecret = data.zoomAPISecret;
      }

      this.selectedTeacher = data;
      this.openBModel(updatezoomdetailsmodel);
  }

  openBModel(content) {


    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      let closeResult = `Closed with: ${result}`;
    }, (reason) => {
      let closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  saveUserDetails(){

    if(this.zoomAPIKey == undefined || this.zoomAPIKey == null || this.zoomAPIKey == ""){
      this.alertService.error("Please enter zoom api key");
      return;
    }

    if(this.zoomAPISecret == undefined || this.zoomAPISecret == null || this.zoomAPISecret == ""){
      this.alertService.error("Please enter zoom api secret key");
      return;
    }

    let formData = {
      zoomAPIKey : this.zoomAPIKey,
      zoomAPISecret : this.zoomAPISecret,
      userId : this.selectedTeacher._id

    }

    this.userService.updateStudentInformation(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.zoomAPIKey = "";
            this.zoomAPISecret = "";
            this.alertService.success(response.responseMessage);
            this.modalService.dismissAll('Close');
          }else{
            this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });


  }
  //updatestudentinformation
}
