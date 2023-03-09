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
  selector: 'app-vyakhyanmala',
  templateUrl: './vyakhyanmala.component.html',
  styleUrls: ['./vyakhyanmala.component.scss'],
})
export class VyakhyanmalaComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  gradeList : any = [];
  gradeId : any = 0;
  mediumsList : any = [];
  mediumId  : any = 0;
  loading : boolean = false;
  datalist : any = [];
  
  createTestFlag : boolean = false;

  title = 'datatables';
  dtOptions: DataTables.Settings =  {};
  dtTrigger: Subject<any> = new Subject<any>();


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
    this.loadDashboardData();
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


  deleteVyakhyanmala(iVyakhyanmalaId,iIndex){
    var c = confirm("Are you sure you want to delete this record?");
    if(c){
      this.userService.deleteVyakhyanmala({ vyakhyanmalaId : iVyakhyanmalaId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
        //  this.testSeriesList.splice(iIndex,1);
          this.alertService.success("Vyakhyanmala deleted successfully");
          this.datalist.splice(iIndex, 1);
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

  loadDashboardData(){
      this.alertService.clear();

      // if(this.gradeId == "0"){
      //   this.alertService.error("Please select class");
      //   return;
      // }

      // if(this.mediumId == "0"){
      //   this.alertService.error("Please select medium");
      //   return;
      // }

      console.log(this.gradeId,this.mediumId)



      this.loading = true;

      this.userService.getVyakhyanmala(this.gradeId,this.mediumId).subscribe(response => {

            console.log(response);  
            if(response.responseCode == 200){

                this.datalist = response.result;
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

    this.userService.vyakhyanmalaBulkupload(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.excelfile = undefined;
            this.loadDashboardData();
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


}
