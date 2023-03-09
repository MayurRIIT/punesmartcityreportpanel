import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { LoginComponent } from "./login/login.component";
import { JwtInterceptor } from "./core/helpers/jwt.interceptor";
import { AlertComponent } from "./components/alert.component";
import { ErrorInterceptor } from "./core/helpers/error.interceptor";

import {NgxPrintModule} from 'ngx-print';


import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpResponse,
  HttpClient,
} from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgSelectModule } from "@ng-select/ng-select";
import { DataTablesModule } from "angular-datatables";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartModule } from "angular-highcharts";
import { MatTableExporterModule } from 'mat-table-exporter';
import { GoogleMapsModule } from '@angular/google-maps'


@NgModule({
  declarations: [AppComponent, LoginComponent, AlertComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    DataTablesModule,
    ChartModule,
    ReactiveFormsModule,
    MatTableExporterModule,
    GoogleMapsModule,
    NgxPrintModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
