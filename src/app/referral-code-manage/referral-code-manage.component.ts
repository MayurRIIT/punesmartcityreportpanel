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
  selector: 'app-referral-code-manage',
  templateUrl: './referral-code-manage.component.html',
  styleUrls: ['./referral-code-manage.component.scss'],
})
export class ReferralCodeManageComponent implements OnInit {

  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;


  loading : boolean = false;
  datalist : any = [];
  searchTerm : string = '';
  userList : any = [];
  title = 'datatables';
  dtOptions: any =  {};
  dtTrigger: Subject<any> = new Subject<any>();
  excelfile: any;
  createTestFlag : boolean = false;
  alertmessage : any;

  referralCode : string = '';
  editReferralCodeUserData : any ;
  editReferralCodeUserIndex : number = 0;

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
          // 'excel'
      ]
    };
  }

  ngAfterViewInit() {
  //  this.getGrade();
   // this.getRoles();
    this.getReferralUsers();
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }

  getReferralUsers(){
    this.userService.getReferralUsers().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.userList = response.result;
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
        this.alertService.error(error);
    });
  }

  exportAllResult(){
    this.router.navigate(['/home/referral-code-users'], { queryParams: { } });

    
  }

  // getGrade(){
  //   this.userService.getGrade().subscribe(response => {
  //         console.log(response);  
  //         if(response.responseCode == 200){
  //           //this.gradeList = response.result;
  //         }else{
  //             this.alertService.error(response.responseMessage);
  //         }       
  //   },
  //   error => {
  //       this.alertService.error(error);
  //   });
  // }


  // getRoles(){
  //   this.userService.getRoles().subscribe(response => {
  //         console.log(response);  
  //         if(response.responseCode == 200){
  //           this.RolesList = response.result;
  //         }else{
  //             this.alertService.error(response.responseMessage);
  //         }       
  //   },
  //   error => {
  //       this.alertService.error(error);
  //   });
  // }
  
  
  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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

  fileChange(element) {
    this.excelfile = element.target.files;
  }

  saveBulkUpload(){

    if(this.excelfile == undefined || this.excelfile == null){
      this.alertService.error("Please select file");
      return;
    }

    console.log(this.excelfile);
    const formData = new FormData();     
    formData.append('file', this.excelfile[0]);  
    console.log(formData);

    this.userService.referralUsersBulkupload(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.excelfile = undefined;
            this.getReferralUsers();
            this.alertService.success(response.result + " record uploaded successfully");
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

  deleteReferralCode(iReferralCodeId,iIndex){
    var c = confirm("Are you sure you want to delete this referral code?");
    if(c){
      this.userService.deleteReferralUsers({ referralCodeId : iReferralCodeId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
        //  this.testSeriesList.splice(iIndex,1);
          this.alertService.success("Referral code deleted successfully");
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.getReferralUsers();
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



  activateReferralCode(iReferralCodeData,iIndex){
    console.log(iReferralCodeData);
    var c = confirm("Are you sure you want to "+(iReferralCodeData.status == "ACTIVE" ? "block" : "active")+" this referral code?");
    if(c){
      this.userService.activateReferralCode({ referralCodeId : iReferralCodeData._id, status : (iReferralCodeData.status == "ACTIVE" ? "BLOCK" : "ACTIVE") }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
          this.alertService.success("Referral code "+(iReferralCodeData.status == "ACTIVE" ? "blocked" : "activated")+" successfully");
          this.userList[iIndex].status = (iReferralCodeData.status == "ACTIVE" ? "BLOCK" : "ACTIVE");
        }else{
          this.alertService.error(response.responseMessage);
        }       
      },
      error => {
          this.alertService.error(error);
      });
    }
  }

  changeReferralCode(iIndex,iData,iUpdateReferralCode){
    this.editReferralCodeUserIndex = iIndex;
    this.editReferralCodeUserData = iData;
    this.referralCode = iData.referralCode;
    this.openBModel(iUpdateReferralCode);
  }

  updateReferralCode(){
     if(this.referralCode == ""){
      this.alertmessage = { type: 'error', cssClass : 'alert alert-danger',text: "Please enter referral code" };
      return;
    }


    let payLoad = {
      referralCode: this.referralCode,
      referralCodeId: this.editReferralCodeUserData._id,
    }

    console.log(payLoad);
   
    this.createTestFlag = true;
    this.userService.updateReferralCode(payLoad).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.alertmessage = { type: 'success',cssClass : 'alert alert-success', text: "Referral code updated successfully" };
            this.userList[this.editReferralCodeUserIndex].referralCode = this.referralCode;
            this.editReferralCodeUserIndex = 0;
            this.editReferralCodeUserData = null;
            this.referralCode = "";
            this.modalService.dismissAll('Close');
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



}
