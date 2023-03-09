import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topmenuheader',
  templateUrl: './topmenuheader.component.html',
  styleUrls: ['./topmenuheader.component.scss'],
})
export class TopmenuheaderComponent implements OnInit {

  constructor( private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {}

    

  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login'], { replaceUrl : true });
  }
  

}
