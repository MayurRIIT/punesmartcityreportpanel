import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AlertService } from '../core/services/alert.service';
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loading = false;
  submitted = false;
  email: string;
  password: string;
  showPassword = true;
  type: string = "password";
  passwordicon: string = "eye";
  year = new Date().getFullYear();
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService
  ) {
      // redirect to home if already logged in
      // let currentUser = localStorage.getItem("currentUser")
      // console.log(currentUser);
      // if (currentUser) {
      //     this.router.navigate(['/home/app-module']);
      // }
  }

  ngOnInit() {
    // this.router.events.subscribe((val) => {
    //   // see also 
    //   console.log("ngOnInit------------>")
    //   console.log(val) 
    // });
    this.route.queryParams
    .subscribe(params => {
      console.log("ngOnInit------------>")
      console.log(params);
      let currentUser = localStorage.getItem("currentUser")
      console.log(currentUser);
      if (currentUser) {
          this.router.navigate(['/home/app-module']);
      }
    });
    this.loading = false;
  }


  showhidepassword() {
    this.showPassword = !this.showPassword;
    this.passwordicon = this.showPassword ? "eye-off" : "eye";
    this.type = this.showPassword ? 'text' : 'password';
  }


  private validateLogin(): boolean {
    if (this.email == undefined) {
      this.alertService.error("Please enter valid email address");
      this.loading = false;
      return false;
    } else if (this.password == undefined || this.password.length == 0) {
      this.alertService.error("Please enter valid password");
      this.loading = false;
      return false;
    } else {

      if(parseInt(this.email)){ // mobile no
          if(this.email.length == 10){
            return true;
          }else{
            this.alertService.error("Please enter valid mobile no");
            this.loading = false;
            return false;
          }
      }else{
        if(!this.validateEmail(this.email)){
          this.alertService.error("Please enter valid email address");
          this.loading = false;
          return false;
        }else{
          return true;
        }
      }


     
    }
  }


  validatePhoneNo (mobileNo)
  {
    var validateMobNum= /^\d*(?:\.\d{1,2})?$/;
    if (validateMobNum.test(mobileNo ) && mobileNo.length == 10) {
      return true; 
    }
    else {
      return false; 
    }
  }

  validateEmail (emailAdress)
  {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
      return true; 
    } else {
      return false; 
    }
  }

  // convenience getter for easy access to form fields

  loginEvent() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
    //   if (this.loginForm.invalid) {
    //       return;
    //   }

    if (this.validateLogin()) {


        let emailFlag = false;
        if(parseInt(this.email)){ // mobile no
          emailFlag = false;
        }else{
          emailFlag = true;
        }

        

        this.loading = true;
        this.authenticationService.login(this.email, this.password,emailFlag)
          .pipe(first())
          .subscribe(
              data => {
                  console.log(data);
                //this.router.navigate(['/home']);

                if(data.responseCode == 200){
                    localStorage.setItem('currentUser', JSON.stringify(data.result));
                    localStorage.setItem('userType', data.result.userType);
                    localStorage.setItem('roleId', data.result.roleId);
                    localStorage.setItem('schoolId', data.result.schoolId);
                    localStorage.setItem('sponsorId', data.result.sponsorId);
                    localStorage.setItem('firstName', data.result.firstName);
                    localStorage.setItem('lastName', data.result.lastName);
                    localStorage.setItem('subName', "");

                    if(data.result.district){
                      localStorage.setItem('districtId', data.result.district._id);
                      localStorage.setItem('districtName', data.result.district.districtName);  
                      localStorage.setItem('subName', "<b>District : </b>"+data.result.district.districtName);

                    }


                    if(data.result.userType == 'SPONSOR'){
                      if(data.result.sponsorInfo)
                          localStorage.setItem('subName', data.result.sponsorInfo.name);
                    }else if(localStorage.getItem("userType") == "SCHOOL" || localStorage.getItem("userType") == "PRINCIPAL" || localStorage.getItem("userType") == "TEACHER") {
                      if(data.result.schoolInfo && data.result.schoolInfo.schoolName)
                        localStorage.setItem('subName', "<b>School : </b>"+data.result.schoolInfo.schoolName);
                    }
                    // else if(localStorage.getItem("userType") == "ADMIN"){
                    //   localStorage.setItem('subName', "Admin");
                    // }else if(localStorage.getItem("userType") == "SUPERADMIN"){
                    //   localStorage.setItem('subName', "Super Admin");
                    // }

                    localStorage.setItem('id', data.result.id);
                    this.authenticationService.setCurrentUserValue(data.result);
                    this.loading = false;
                    this.router.navigate(['/home/app-module']);
                }else{
                    this.alertService.error(data.responseMessage);
                    this.loading = false;
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });

    }

      
  }

}
