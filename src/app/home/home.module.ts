import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomePage } from "./home.page";

import { HomePageRoutingModule } from "./home-routing.module";

import { ContentusagereportComponent } from "../contentusagereport/contentusagereport.component";
import { SponsorsumreportComponent } from "../sponsorsumreport/sponsorsumreport.component";
import { StudentlearreportComponent } from "../studentlearreport/studentlearreport.component";
import { TeacherusareportComponent } from "../teacherusareport/teacherusareport.component";
import { ContentstatreportComponent } from "../contentstatreport/contentstatreport.component";
import { EnrolpaymentreportComponent } from "../enrolpaymentreport/enrolpaymentreport.component";
import { CouponusagereportComponent } from "../couponusagereport/couponusagereport.component";
import { SidenavmenuComponent } from "../sidenavmenu/sidenavmenu.component";
import { TopmenuheaderComponent } from "../topmenuheader/topmenuheader.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { NgSelectModule } from "@ng-select/ng-select";
import { DataTablesModule } from "angular-datatables";

import { AskaquestionreportComponent } from "../askaquestionreport/askaquestionreport.component";
import { UseregistrationreportComponent } from "../useregistrationreport/useregistrationreport.component";
import { HelpsupportreportComponent } from "../helpsupportreport/helpsupportreport.component";
import { HelpsupportcallbackrequestreportComponent } from "../helpsupportcallbackrequestreport/helpsupportcallbackrequestreport.component";
import { HomeTabsComponent } from "./components/home-tabs/home-tabs.component";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../shared/material.module";
import { HomeDashboardComponent } from "./components/home-dashboard/home-dashboard.component";
import { ChartModule } from "angular-highcharts";
import { ExamEvaluationComponent } from "../exam-evaluation/exam-evaluation.component";
import { ViewExamResponseComponent } from "../view-exam-response/view-exam-response.component";
import { EvaluateExamResponseComponent } from "../evaluate-exam-response/evaluate-exam-response.component";
import { SafePipe } from "../core/pipes/safe.pipe";
import { HomeUserContentComponent } from "./components/home-user-content/home-user-content.component";
import { EditExamEvaluationComponent } from "../edit-exam-evaluation/edit-exam-evaluation.component";
import { SelectTeacherComponent } from "../select-teacher/select-teacher.component";
import { DailySummaryComponent } from "../daily-summary/daily-summary.component";
import { RolemasterComponent } from "../rolemaster/rolemaster.component";
import { UsersmasterComponent } from "../usersmaster/usersmaster.component";

import { QuestionBankComponent } from '../question-bank/question-bank.component';
import { ExammanagementComponent } from '../exammanagement/exammanagement.component';
import { SchoolmasterComponent } from '../schoolmaster/schoolmaster.component';
import { TestseriesComponent } from '../testseries/testseries.component';
import { EvaluateTestSeriesResponseComponent } from '../evaluate-testseries-response/evaluate-testseries-response.component';
import { ViewTestSeriesResponseComponent } from '../view-testseries-response/view-testseries-response.component';
import { ExamManagementResponseComponent } from '../exam-management-response/exam-management-response.component';
import { TestseriespurchaseuserComponent } from '../testseriespurchaseuser/testseriespurchaseuser.component';
import { SubjectteacherlinkupComponent } from '../subjectteacherlinkup/subjectteacherlinkup.component';
import { VyakhyanmalaComponent } from '../vyakhyanmala/vyakhyanmala.component';
import { TeacherManageComponent } from '../teacher-manage/teacher-manage.component';

import { ScholarshipComponent } from '../scholarship/scholarship.component';
import { EvaluateScholarshipResponseComponent } from '../evaluate-scholarship-response/evaluate-scholarship-response.component';
import { ScholarshippurchaseuserComponent } from '../scholarshippurchaseuser/scholarshippurchaseuser.component';
import { ViewScholarshipResponseComponent } from '../view-scholarship-response/view-scholarship-response.component';
import { ContentMediumMappingComponent } from '../content-medium-mapping/content-medium-mapping.component';
import { UpgradeSectionComponent } from '../upgrade-section/upgrade-section.component';
import { MediaSectionComponent } from '../media-section/media-section.component';
import { PupupFormComponent } from "../contentusagereport/popup/pup-up-form";

import { CompetitionsComponent } from '../competitions/competitions.component';
import { ViewCompetitionResponseComponent } from '../view-competition-response/view-competition-response.component';
import { ViewCompetitionEnrollUserComponent } from '../view-competition-enroll-user/view-competition-enroll-user.component';	
import { RoleCostManageComponent } from '../role-cost-manage/role-cost-manage.component';
import { ReferralCodeManageComponent } from '../referral-code-manage/referral-code-manage.component';
import { ReferralCodeUsersComponent } from '../referral-code-users/referral-code-users.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { SchoolDashboardComponent } from '../school-dashboard/school-dashboard.component';
import { AppModulesComponent } from '../app-modules/app-modules.component';

import { MatTableExporterModule } from 'mat-table-exporter';
import { GoogleMapsModule } from '@angular/google-maps'
import {NgxPrintModule} from 'ngx-print';
import { CaseStudyComponent } from "../case-study/case-study.component";
import { RemedialLearningComponent } from "../remedial-learning/remedial-learning.component";
import { ExamScheduleComponent } from "../exam-schedule/exam-schedule.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    IonicModule,
    HomePageRoutingModule,
    NgbModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    DataTablesModule,
    RouterModule,
    ReactiveFormsModule,
    ChartModule,
    ReactiveFormsModule,
    MatTableExporterModule,
    GoogleMapsModule,
    NgxPrintModule
  ],
  declarations: [
    HomePage,
    ContentusagereportComponent,
    SponsorsumreportComponent,
    StudentlearreportComponent,
    TeacherusareportComponent,
    ContentstatreportComponent,
    EnrolpaymentreportComponent,
    CouponusagereportComponent,
    SidenavmenuComponent,
    TopmenuheaderComponent,
    AskaquestionreportComponent,
    UseregistrationreportComponent,
    HelpsupportreportComponent,
    HelpsupportcallbackrequestreportComponent,
    HomeTabsComponent,
    HomeDashboardComponent,
    ExamEvaluationComponent,
    ViewExamResponseComponent,
    EvaluateExamResponseComponent,
    SafePipe,
    HomeUserContentComponent,
    EditExamEvaluationComponent,
    SelectTeacherComponent,
    DailySummaryComponent,
    UsersmasterComponent,
    RolemasterComponent,
    QuestionBankComponent,
    ExammanagementComponent,
    SchoolmasterComponent,
    TestseriesComponent,
    ViewTestSeriesResponseComponent,
    EvaluateTestSeriesResponseComponent,
    ExamManagementResponseComponent,
    TestseriespurchaseuserComponent,
    SubjectteacherlinkupComponent,
    VyakhyanmalaComponent,
    TeacherManageComponent,
    ScholarshipComponent,
    ScholarshippurchaseuserComponent,
    EvaluateScholarshipResponseComponent,
    ViewScholarshipResponseComponent,
    ContentMediumMappingComponent,
    UpgradeSectionComponent,
    MediaSectionComponent,
    CompetitionsComponent,
    ViewCompetitionResponseComponent,
    ViewCompetitionEnrollUserComponent,
    PupupFormComponent,
    RoleCostManageComponent,
    ReferralCodeManageComponent,
    ReferralCodeUsersComponent,
    AdminDashboardComponent,
    SchoolDashboardComponent,
    AppModulesComponent,
    CaseStudyComponent,
    RemedialLearningComponent,
    ExamScheduleComponent
  ],
  entryComponents: [EditExamEvaluationComponent, SelectTeacherComponent],
})
export class HomePageModule {}
