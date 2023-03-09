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

@Component({
  selector: 'app-rolemaster',
  templateUrl: './rolemaster.component.html',
  styleUrls: ['./rolemaster.component.scss'],
})
export class RolemasterComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  datalist : any = [];
  webModuleslist : any = [];
  roleId : any = 0;
  loading : boolean = false;

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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
         
      ]
    };

  }

  ngAfterViewInit() {
    this.getRoles();
    this.getWebModules();
  }

  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
  }


  getRoles(){
    this.loading = true;
    this.userService.getRoles().subscribe(response => {
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

  getWebModules(){
    this.userService.getWebModules().subscribe(response => {
          console.log(response);  
          if(response.responseCode == 200){
            this.webModuleslist = response.result;
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });
  }

  onEditAccess(iIndex,iModel){
    
    this.resetField();

    this.roleId = this.datalist[iIndex]._id;

    for(let j = 0 ; j < this.datalist[iIndex].moduleArray.length ; j++){

      for(let i = 0 ; i < this.webModuleslist.length ; i++){
        if(this.webModuleslist[i]._id == this.datalist[iIndex].moduleArray[j]._id){
          this.webModuleslist[i].selected = true;
          break;
        }
      }

    }
    

    this.openBModel(iModel);

  }


  openBModel(content) {


    this.modalService.open(content, { windowClass : "selectedQuestionModalClass", ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(`Closed with: ${result}`);


      this.resetField();

    }, (reason) => {

    
      this.resetField();

      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  resetField(){
    this.roleId = 0;
    for(let i = 0 ; i < this.webModuleslist.length ; i++){
      this.webModuleslist[i].selected = false;
    }
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

  saveModules(){

    let webModulesIds = [];
    for(let i = 0 ; i < this.webModuleslist.length ; i++){
      if(this.webModuleslist[i].selected){
        webModulesIds.push(this.webModuleslist[i]._id);
      }
    }
    console.log(this.webModuleslist);
    
    let _userObj = {
      roleId : this.roleId,
      moduleArray : webModulesIds,
    }


    this.userService.updateWebModuleToRole(_userObj).subscribe((response) => {

          console.log(response);  
          if(response.responseCode == 200){
            this.resetField();
            this.modalService.dismissAll('Close');
            this.getRoles();
          }else{
              this.alertService.error(response.responseMessage);
          }       
    },
    error => {
        this.alertService.error(error);
    });

  }


}
