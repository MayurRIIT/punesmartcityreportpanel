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
  selector: 'app-scholarshippurchaseuser',
  templateUrl: './scholarshippurchaseuser.component.html',
  styleUrls: ['./scholarshippurchaseuser.component.scss'],
})
export class ScholarshippurchaseuserComponent implements OnInit {

  public scholarshipId: string = '';
  public scholarshipName : string = '';
  usersList : any = [];

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

    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.scholarshipId = params.scholarshipId;
        this.scholarshipName = params.scholarshipName;
        this.getscholarshipUsersList();

        console.log("=========scholarshipId=====>", this.scholarshipId);
      });


  }


  exportAsXLSX():void {
    //this.excelService.exportAsExcelFile(this.datalist, 'footballer_data');
    TableUtil.exportToExcel("ExampleTable");
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

  getscholarshipUsersList() {
    this.userService.getscholarshipUserList(this.scholarshipId)
      .subscribe((res: any) => {
        console.log('my res', res.result);
        this.usersList = res.result.usersList;
        this.dtTrigger.next();
      })
  }


}
