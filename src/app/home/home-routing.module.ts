import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomePage } from "./home.page";

import { ContentusagereportComponent } from "../contentusagereport/contentusagereport.component";
import { SponsorsumreportComponent } from "../sponsorsumreport/sponsorsumreport.component";
import { StudentlearreportComponent } from "../studentlearreport/studentlearreport.component";
import { TeacherusareportComponent } from "../teacherusareport/teacherusareport.component";
import { ContentstatreportComponent } from "../contentstatreport/contentstatreport.component";
import { EnrolpaymentreportComponent } from "../enrolpaymentreport/enrolpaymentreport.component";
import { CouponusagereportComponent } from "../couponusagereport/couponusagereport.component";
import { AskaquestionreportComponent } from "../askaquestionreport/askaquestionreport.component";
import { UseregistrationreportComponent } from "../useregistrationreport/useregistrationreport.component";
import { HelpsupportreportComponent } from "../helpsupportreport/helpsupportreport.component";
import { HelpsupportcallbackrequestreportComponent } from "../helpsupportcallbackrequestreport/helpsupportcallbackrequestreport.component";
import { HomeDashboardComponent } from "./components/home-dashboard/home-dashboard.component";
import { HomeUserContentComponent } from "./components/home-user-content/home-user-content.component";
import { ExamEvaluationComponent } from "../exam-evaluation/exam-evaluation.component";
import { ViewExamResponseComponent } from "../view-exam-response/view-exam-response.component";
import { EvaluateExamResponseComponent } from "../evaluate-exam-response/evaluate-exam-response.component";
import { DailySummaryComponent } from "../daily-summary/daily-summary.component";
import { RolemasterComponent } from "../rolemaster/rolemaster.component";
import { UsersmasterComponent } from "../usersmaster/usersmaster.component";

import { QuestionBankComponent } from "../question-bank/question-bank.component";
import { ExammanagementComponent } from "../exammanagement/exammanagement.component";
import { SchoolmasterComponent } from "../schoolmaster/schoolmaster.component";
import { TestseriesComponent } from "../testseries/testseries.component";
import { ViewTestSeriesResponseComponent } from "../view-testseries-response/view-testseries-response.component";
import { EvaluateTestSeriesResponseComponent } from "../evaluate-testseries-response/evaluate-testseries-response.component";
import { ExamManagementResponseComponent } from "../exam-management-response/exam-management-response.component";
import { TestseriespurchaseuserComponent } from "../testseriespurchaseuser/testseriespurchaseuser.component";
import { SubjectteacherlinkupComponent } from "../subjectteacherlinkup/subjectteacherlinkup.component";
import { VyakhyanmalaComponent } from "../vyakhyanmala/vyakhyanmala.component";
import { TeacherManageComponent } from "../teacher-manage/teacher-manage.component";

import { ScholarshipComponent } from "../scholarship/scholarship.component";
import { EvaluateScholarshipResponseComponent } from "../evaluate-scholarship-response/evaluate-scholarship-response.component";
import { ScholarshippurchaseuserComponent } from "../scholarshippurchaseuser/scholarshippurchaseuser.component";
import { ViewScholarshipResponseComponent } from "../view-scholarship-response/view-scholarship-response.component";
import { UpgradeSectionComponent } from "../upgrade-section/upgrade-section.component";
import { MediaSectionComponent } from "../media-section/media-section.component";

import { ContentMediumMappingComponent } from '../content-medium-mapping/content-medium-mapping.component';

import { CompetitionsComponent } from '../competitions/competitions.component';
import { ViewCompetitionResponseComponent } from '../view-competition-response/view-competition-response.component';
import { ViewCompetitionEnrollUserComponent } from '../view-competition-enroll-user/view-competition-enroll-user.component';	

import { RoleCostManageComponent } from '../role-cost-manage/role-cost-manage.component';
import { ReferralCodeManageComponent } from '../referral-code-manage/referral-code-manage.component';
import { ReferralCodeUsersComponent } from '../referral-code-users/referral-code-users.component';

import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { SchoolDashboardComponent } from '../school-dashboard/school-dashboard.component';
import { AppModulesComponent } from '../app-modules/app-modules.component';
import { CaseStudyComponent } from "../case-study/case-study.component";
import { RemedialLearningComponent } from "../remedial-learning/remedial-learning.component";
import { ExamScheduleComponent } from "../exam-schedule/exam-schedule.component";

const routes: Routes = [
  { path: 'app-module', component: AppModulesComponent },

  {
    path: "",
    component: HomePage,
    children: [
      {
        path: "",
        redirectTo: "user-dashboard",
      },
      {
        path: "dashboard",
        component: HomeDashboardComponent,
      },
      {
        path: "user-content",
        component: HomeUserContentComponent,
      },
      {
        path: "user-dashboard",
        component: AdminDashboardComponent,
      },
      {
        path: "learning-dashboard",
        component: SchoolDashboardComponent,
      }
    ],
  },
  
  {
    path: "exam-evaluation",
    component: ExamEvaluationComponent,
  },
  {
    path: "view-exam-response/:id",
    component: ViewExamResponseComponent,
  },
  {
    path: "evaluate-exam-response",
    component: EvaluateExamResponseComponent,
  },
  { path: "content-usage-report", component: ContentusagereportComponent },
  { path: "sponsor-summary-report", component: SponsorsumreportComponent },
  { path: "student-learning-report", component: StudentlearreportComponent },
  { path: "teacher-usage-report", component: TeacherusareportComponent },
  { path: "content-status-report", component: ContentstatreportComponent },
  { path: "enrollment-payment-report", component: EnrolpaymentreportComponent },
  { path: "coupon-usage-report", component: CouponusagereportComponent },
  { path: "responses-report", component: AskaquestionreportComponent },
  {
    path: "user-registration-report",
    component: UseregistrationreportComponent,
  },
  { path: "helpsupport-report", component: HelpsupportreportComponent },
  {
    path: "helpsupport-callback-report",
    component: HelpsupportcallbackrequestreportComponent,
  },
  { path: "daily-summary", component: DailySummaryComponent },
  { path: "roles", component: RolemasterComponent },
  { path: "users", component: UsersmasterComponent },

  { path: "question-bank", component: QuestionBankComponent },

  { path: "vyakhyanmala", component: VyakhyanmalaComponent },

  { path: "teacher-management", component: TeacherManageComponent },

  {
    path: "exams",
    component: ExammanagementComponent,
  },
  {
    path: "exam-response/:id",
    component: ExamManagementResponseComponent,
  },
  { path: "schools", component: SchoolmasterComponent },

  { path: "testseries", component: TestseriesComponent },
  {
    path: "view-testseries-response",
    component: ViewTestSeriesResponseComponent,
  },
  {
    path: "evaluate-testseries-response",
    component: EvaluateTestSeriesResponseComponent,
  },
  { path: "testseries-user", component: TestseriespurchaseuserComponent },
  { path: "subject-teacher-linkup", component: SubjectteacherlinkupComponent },

  { path: "scholarship", component: ScholarshipComponent },
  {
    path: "view-scholarship-response",
    component: ViewScholarshipResponseComponent,
  },
  {
    path: "evaluate-scholarship-response",
    component: EvaluateScholarshipResponseComponent,
  },
  { path: "scholarship-user", component: ScholarshippurchaseuserComponent },
  { path: "upgrade-section", component: UpgradeSectionComponent },
  { path: "media-section/:id/:title", component: MediaSectionComponent },
  { path: 'content-medium-mapping', component: ContentMediumMappingComponent },
  { path: 'competitions', component: CompetitionsComponent },
  { path: 'view-competition-response', component: ViewCompetitionResponseComponent },
  { path: 'view-competition-enroll-user', component: ViewCompetitionEnrollUserComponent },
  { path: 'role-cost-manage', component: RoleCostManageComponent },
  { path: 'referral-code-manage', component: ReferralCodeManageComponent },
  { path: 'referral-code-users', component: ReferralCodeUsersComponent },
  { path: "case-study", component: CaseStudyComponent },
  { path: "remedial-learning", component: RemedialLearningComponent },
  { path: "exam-schedule", component: ExamScheduleComponent },



  // { path: 'admin-dashboard', component: AdminDashboardComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
