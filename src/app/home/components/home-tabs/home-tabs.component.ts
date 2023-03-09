import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.component.html',
  styleUrls: ['./home-tabs.component.scss'],
})
export class HomeTabsComponent implements OnInit {
  public tabs = [
    // {
    //   name: 'Dashboard',
    //   url: 'dashboard'
    // },
    // {
    //   name: 'User Content Use',
    //   url: 'user-content'
    // }
  ]
  constructor() {

    if (localStorage.getItem("userType") == "ADMIN") {
      this.tabs.push(
        {
          name: 'User-Dashboard',
          url: 'user-dashboard'
        },{
          name: 'Learning-Dashboard',
          url: 'learning-dashboard'
        })
    }else if (localStorage.getItem("userType") == "SPONSOR") {
      this.tabs.push(
        {
          name: 'User-Dashboard',
          url: 'user-dashboard'
        },{
          name: 'Learning-Dashboard',
          url: 'learning-dashboard'
        })
    }else if (localStorage.getItem("userType") == "SCHOOL" || localStorage.getItem("userType") == "PRINCIPAL" || localStorage.getItem("userType") == "TEACHER") {
      this.tabs.push(
        {
          name: 'User-Dashboard',
          url: 'user-dashboard'
        },{
          name: 'Learning-Dashboard',
          url: 'learning-dashboard'
        })
    }
  }

  ngOnInit() { }


}
