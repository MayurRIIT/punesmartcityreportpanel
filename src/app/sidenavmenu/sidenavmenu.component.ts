import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-sidenavmenu',
  templateUrl: './sidenavmenu.component.html',
  styleUrls: ['./sidenavmenu.component.scss'],
})
export class SidenavmenuComponent implements OnInit {

  moduleselected: string = "home";
  sideMenuList: any;

  firstName: string = "";
  lastName: string = "";
  subName: string = "";
  userType: string = "";


  constructor(private router: Router, private userService: UserService, private alertService: AlertService,) { }


  ngOnInit() {

    // console.log("-----ngOnInit - SidenavmenuComponent----------- ")

    if (localStorage.getItem("sidemenuurl"))
      this.moduleselected = localStorage.getItem("sidemenuurl");

      this.firstName = localStorage.getItem("firstName");
      this.lastName = localStorage.getItem("lastName");
      this.subName = localStorage.getItem("subName");
      this.userType = localStorage.getItem("userType");

    this.getSideMenus();
  }

  getSideMenus() {
    this.userService.getSideMenuItem(localStorage.getItem("roleId")).subscribe(response => {
      console.log(response);
      if (response.responseCode == 200) {
        //webMainModules , roleModules
        //this.sideMenuList = response.result.roleModules.moduleArray;let moduleArray = response.result.roleModules.moduleArray;
        let moduleArray = response.result.roleModules.moduleArray;
       
        let webMainModules = response.result.webMainModules;

        let expandsidemenuid = "";
        if (localStorage.getItem("expandsidemenuid"))
            expandsidemenuid = localStorage.getItem("expandsidemenuid");
        
        let obj = {};
        moduleArray.map(moduleelement => {

          let hideArr = ['Content Status Report','Daily Summary Report','Enrollment Payment Report','Coupon Usage Report','Sponsor Summary Report','व्याख्यानमाला','Video - Medium Mapping','Role-Cost Manage','Assign Referral Code']

          if(hideArr.indexOf(moduleelement.name) > -1){
            
          }else{
            webMainModules.map(mainModule => {
            
              if(mainModule.webmodules && mainModule.webmodules.length == 0 && mainModule.url != ""){
                mainModule.children = [];
                mainModule.expandFlag = expandsidemenuid == mainModule._id ? true : false;
                obj[mainModule._id] = mainModule;
              }else{
                mainModule.expandFlag = expandsidemenuid == mainModule._id ? true : false;
                mainModule.webmodules.find(mainModuleelement => {
                  if(mainModuleelement._id == moduleelement._id){
                    mainModuleelement.webMainModuleId = mainModule;
                    if(mainModule.children){
                      mainModule.children.push(mainModuleelement);
                    }else{
                      mainModule.children = [mainModuleelement];
                    }
                    
                    obj[mainModule._id] = mainModule
                  }          
                });
              }    
            });
          }
         
        });

        if(obj['6286a8fc3a548353cd043bc3']){
          let obj11 = {
            aliasName : "",
            createdAt: "2021-11-18T13:27:57.580Z",
            name: "Case Study",
            sequenceNumber: 1,
            status: "ACTIVE",
            thumbnail: "fa fa-bullseye",
            updatedAt: "2021-11-18T13:27:57.580Z",
            url: "/home/case-study",
            _id : 'case-study',
            webMainModuleId : obj['6286a8fc3a548353cd043bc3']

          }
          let obj1111 = {
            aliasName : "",
            createdAt: "2021-11-18T13:27:57.580Z",
            name: "Remedial Learning",
            sequenceNumber: 1,
            status: "ACTIVE",
            thumbnail: "fa fa-user-secret",
            updatedAt: "2021-11-18T13:27:57.580Z",
            url: "/home/remedial-learning",
            _id : 'remedial-learning',
            webMainModuleId : obj['6286a8fc3a548353cd043bc3']
          }
          let obj111 = {
            aliasName : "",
            createdAt: "2021-11-18T13:27:57.580Z",
            name: "Class/Exam Schedule",
            sequenceNumber: 1,
            status: "ACTIVE",
            thumbnail: "fa fa-users",
            updatedAt: "2021-11-18T13:27:57.580Z",
            url: "/home/exam-schedule",
            _id : 'exam-schedule',
            webMainModuleId : obj['6286a8fc3a548353cd043bc3']
          }
          obj['6286a8fc3a548353cd043bc3'].children.push(obj1111,obj111,obj11);
        }
        //console.log(obj,"-------------");
        moduleArray = [];
        for (let key in obj) {
          moduleArray.push(obj[key]);
        }

        moduleArray.sort(function (a, b) {
          return a.sequenceNumber - b.sequenceNumber;
        });
      
        console.log(moduleArray);
        
        this.sideMenuList = moduleArray;
      } else {
        this.alertService.error(response.responseMessage);
      }
    },
      error => {
        this.alertService.error(error);
      });
  }

  ngAfterViewInit() {

  }

  loadModule(event,iModule) {
    console.log('loadModule',iModule)
    event && event.stopPropagation();
    localStorage.setItem("sidemenuname", iModule.name);
    localStorage.setItem("sidemenuurl", iModule.url);
    this.moduleselected = iModule.url;
    this.router.navigate(['../' + iModule.url], { replaceUrl: true });

    localStorage.setItem("expandsidemenuid", iModule.webMainModuleId ? iModule.webMainModuleId._id : iModule._id);

  }


  loadMainModule(event,iModule) {
    console.log('loadMainModule',iModule)
    event.stopPropagation();

    if(this.moduleselected == iModule.url) return;

    this.sideMenuList.map(moduleelement => {
      moduleelement.expandFlag = false;
    });

    if(iModule.url != "" && iModule.children.length == 0){
      iModule.expandFlag = false;
      this.loadModule(null,iModule);
    }else{
      iModule.expandFlag = true;
    }
  }

  public goTo(link) {
    this.moduleselected = 'daily-summary';
    this.router.navigate(['home', link]);
  }


}
