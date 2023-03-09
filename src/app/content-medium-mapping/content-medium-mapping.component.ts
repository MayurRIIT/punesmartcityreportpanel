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
  selector: 'app-content-medium-mapping',
  templateUrl: './content-medium-mapping.component.html',
  styleUrls: ['./content-medium-mapping.component.scss'],
})
export class ContentMediumMappingComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  loading : boolean = false;
  datalist : any = [];
 
  closeResult: string;
  searchTerm : string = '';

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
    this.loadDashboardData();    
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTableMain");
  }



  loadDashboardData(){
      this.alertService.clear();

      this.loading = true;

      this.userService.getContentMapping().subscribe(response => {

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

  fileChange(element) {
    this.excelfile = element.target.files;
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

  saveBulkUpload(){

    if(this.excelfile == undefined || this.excelfile == null){
      this.alertService.error("Please select file");
      return;
    }

    console.log(this.excelfile);
    const formData = new FormData();  

    formData.append('file', this.excelfile[0]);  
    console.log(formData);

    this.userService.updateContentMediums(formData).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.excelfile = undefined;
            this.alertService.success("Content mapping successfully");
            this.modalService.dismissAll('Close');
            this.loadDashboardData();
            
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });


  }

  deleteMapping(mappingId,iIndex){
    var _co = confirm("Are you sure, you want to delete mapping?");
    if(_co){
      this.userService.deleteMapping({ mappingId : mappingId }).subscribe(response => {

        console.log(response);  
        if(response.responseCode == 200){
        //  this.testSeriesList.splice(iIndex,1);
          this.alertService.success("Mapping deleted successfully");
          this.datalist.splice(iIndex,1);
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
  }



}
