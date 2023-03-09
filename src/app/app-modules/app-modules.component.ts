import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-modules',
  templateUrl: './app-modules.component.html',
  styleUrls: ['./app-modules.component.scss'],
})
export class AppModulesComponent implements OnInit {

  constructor(private router: Router, private userService: UserService,) {

  }

  sideMenuList: any = [];
  firstName: string = "";
  lastName: string = "";
  subName: string = "";
  userType: string = "";

  ngOnInit() {
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

        let obj = {};
        moduleArray.map(moduleelement => {
          webMainModules.map(mainModule => {
            if(mainModule.webmodules && mainModule.webmodules.length == 0 && mainModule.url != ""){
              mainModule.children = [];
              mainModule.children.push({
                'aliasName': "",
                'createdAt': "2021-11-18T13:27:57.583Z",
                'name': "Dashboard",
                'sequenceNumber': 1,
                'status': "ACTIVE",
                'thumbnail': "fa fa-dashboard",
                'updatedAt': "2021-11-18T13:27:57.583Z",
                'url': "/home",
                'webMainModuleId': mainModule,
                '_id': mainModule._id

              });
              obj[mainModule._id] = mainModule;
            }else{
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
        });

        moduleArray = [];
        for (let key in obj) {
          moduleArray.push(obj[key]);
        }

        moduleArray.sort(function (a, b) {
          return a.sequenceNumber - b.sequenceNumber;
        });
      
        console.log(moduleArray);
        
        this.sideMenuList = moduleArray;
      } else{
        alert("Something went wrong. Please re-login the application")
      }
    });
  }

  loadModule(event,iModule) {
    console.log('loadModule',iModule)
    let module = iModule.children[0];
    localStorage.setItem("sidemenuname", module.name);
    localStorage.setItem("sidemenuurl", module.url);
    localStorage.setItem("expandsidemenuid", module.webMainModuleId ? module.webMainModuleId._id : module._id);
    this.router.navigate(['../' + module.url], { replaceUrl: true });
  }




  
}
