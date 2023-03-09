import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment as env } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  getSponsor() {
    return this.http.get<any>(`${env.api}/getSponsor`);
  }

  getGrade() {
    return this.http.get<any>(`${env.api}/getgrade`);
  }

  getSubjectList(gradeId, mediumId) {
    return this.http.get<any>(
      `${env.api}/getrsubjectlist?gradeId=${gradeId}&mediumId=${mediumId}`
    );
  }

  getDashboardData(
    userCategory,
    sponsorId,
    gradeId,
    viewtype,
    selectfromdate,
    selecttodate
  ) {
    return this.http.get<any>(
      `${env.api}/getdashboarddata?userCategory=${userCategory}&sponsorId=${sponsorId}&gradeId=${gradeId}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}`
    );
  }

  getContentUsageData(
    userCategory,
    sponsorId,
    gradeId,
    mediumId,
    schoolIds,
    viewtype,
    selectfromdate,
    selecttodate,
    pageIndex,
    pageSize
  ) {
    return this.http.get<any>(
      `${env.api}/getContentUsageReport?userCategory=${userCategory}&sponsorId=${sponsorId}&gradeId=${gradeId}&mediumId=${mediumId}&schoolIds=${schoolIds}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&pageNumber=${pageIndex}&limit=${pageSize}`
    );
  }

  getSchoolList() {
    return this.http.get<any>(`${env.api}/getschoollist`);
  }

  getSchoolListByDistrict(payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/getSchoolListByDistrict`,payload);
  }

  getDistrict() {
    return this.http.get<any>(`${env.api}/getDistrict`);
  }

  getMediumsList() {
    return this.http.get<any>(`${env.api}/getmediumslist`);
  }

  getChapterList(subjectId) {
    return this.http.get<any>(
      `${env.api}/getrchapterlist?subjectId=${subjectId}`
    );
  }

  getSponsorReport(
    sponsorId,
    viewtype,
    selectfromdate,
    selecttodate,
    schoolId,
    mediumId
  ) {
    return this.http.get<any>(
      `${env.api}/getsponsorreport?schoolId=${schoolId}&mediumId=${mediumId}&sponsorId=${sponsorId}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}`
    );
  }

  getStudentlearningReport(
    gradeId,
    schoolId,
    mediumId,
    contentType,
    userType,
    viewtype,
    selectfromdate,
    selecttodate,
    pageIndex,
    pageSize
  ) {
    return this.http.get<any>(
      `${env.api}/getstudentlearningreport?schoolId=${schoolId}&mediumId=${mediumId}&gradeId=${gradeId}&contentType=${contentType}&userType=${userType}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&pageNumber=${pageIndex}&limit=${pageSize}`
    );
  }

  getEnrollmentPaymentStatus(
    gradeId,
    mediumId,
    sponsorId,
    schoolIds,
    paymentStatusId,
    viewtype,
    selectfromdate,
    selecttodate,
    pageIndex,
    pageSize
  ) {
    return this.http.get<any>(
      `${env.api}/getEnrollmentPaymentReport?mediumId=${mediumId}&gradeId=${gradeId}&sponsorId=${sponsorId}&schoolIds=${schoolIds}&paymentStatusId=${paymentStatusId}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&pageNumber=${pageIndex}&limit=${pageSize}`
    );
  }

  getContentStatusReport(gradeId, mediumId, subjectId, contentType) {
    return this.http.get<any>(
      `${env.api}/getcontentstatusreport?gradeId=${gradeId}&mediumId=${mediumId}&subjectId=${subjectId}&contentType=${contentType}`
    );
  }

  getCouponStatusReport(
    sponsorId,
    couponStatus,
    viewtype,
    selectfromdate,
    selecttodate,
    bulkActivateCoupon,
    pageIndex,
    pageSize
  ) {
    return this.http.get<any>(
      `${env.api}/getcouponstatusreport?sponsorId=${sponsorId}&couponStatus=${couponStatus}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&bulkActivateCoupon=${bulkActivateCoupon}&pageNumber=${pageIndex}&limit=${pageSize}`
    );
  }

  getAskAQuestionsReport(
    gradeId,
    mediumId,
    subjectId,
    chapterId,
    contentType,
    viewtype,
    selectfromdate,
    selecttodate
  ) {
    return this.http.get<any>(
      `${env.api}/getaskaquestionsreport?gradeId=${gradeId}&mediumId=${mediumId}&subjectId=${subjectId}&chapterId=${chapterId}&contentType=${contentType}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}`
    );
  }

  getStudentRegistrationReport(
    gradeId,
    schoolId,
    mediumId,
    viewtype,
    selectfromdate,
    selecttodate,
    pageIndex,
    pageSize
  ) {
    return this.http.get<any>(
      `${env.api}/getstudentregistrationreport?schoolId=${schoolId}&mediumId=${mediumId}&gradeId=${gradeId}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&pageNumber=${pageIndex}&limit=${pageSize}`
    );
  }

  searchData(mobileNumber,
    pageIndex,
    pageSize) {
    return this.http.get<any>(
      `${env.api}/searchdata?mobileNumber=${mobileNumber}&pageNumber=${pageIndex}&limit=${pageSize}`
    );
  }

  updateStudentInformation = (body) => {
    return this.http.post<any>(`${env.api}/updatestudentinformation`, body);
  };


  updateStudentdeviceIdData = (body) => {
    return this.http.post<any>(`${env.api}/updateStudentdeviceIdData`, body);
  };

  
  addaskaquestionanswer = (body) => {
    return this.http.post<any>(`${env.api}/addaskaquestionanswer`, body);
  };

  getHelpSupportQuestionsReport(
    gradeId,
    mediumId,
    viewtype,
    selectfromdate,
    selecttodate
  ) {
    return this.http.get<any>(
      `${env.api}/gethelpsupportquestionsreport?gradeId=${gradeId}&mediumId=${mediumId}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}`
    );
  }

  addHelpSupportAnswer = (body) => {
    return this.http.post<any>(`${env.api}/addhelpsupportanswer`, body);
  };

  getHelpSupportCallbackRequestQuestionsReport(
    gradeId,
    mediumId,
    viewtype,
    selectfromdate,
    selecttodate
  ) {
    return this.http.get<any>(
      `${env.api}/gethelpsupportquestionscallbackrequestreport?gradeId=${gradeId}&mediumId=${mediumId}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}`
    );
  }

  addHelpSupportCallBackRequestAnswer = (body) => {
    return this.http.post<any>(
      `${env.api}/addhelpsupportcallbackrequestanswer`,
      body
    );
  };

  getSchoolList1() {
    return this.http.get<any>(`${env.baseUrl}/user/school`);
  }

  getMediumsList1() {
    return this.http.get<any>(`${env.baseUrl}/user/medium`);
  }

  getGrade1() {
    return this.http.get<any>(`${env.baseUrl}/user/grade`);
  }

  getSubjectList1(gradeId, mediumId) {
    return this.http.get<any>(
      `${env.baseUrl}/admin/getSubjects?gradeId=${gradeId}&mediumId=${mediumId}`
    );
  }

  uploadQuestionPaper(formData: any): Observable<Response> {
    return this.http.post<Response>(
      `${env.baseUrl}/common/uploadFile/QuestionPapers`,
      formData
    );
  }

  addExam(payLoad: any): Observable<Response> {
    return this.http.post<Response>(
      `${env.baseUrl}/admin/report/evaluation/exam`,
      payLoad
    );
  }

  getExam() {
    return this.http.get<Response>(
      `${env.baseUrl}/admin/report/evaluation/examList`
    );
  }

  getExamResponse(id) {
    return this.http.get<Response>(
      `${env.baseUrl}/admin/report/evaluation/examResponseList?id=${id}`
    );
  }

  getEvaluatedSheet(id) {
    return this.http.get<Response>(
      `${env.baseUrl}/admin/report/evaluation/getEvaluatedSheet?id=${id}`
    );
  }

  postExamEvaluationResponse(id, payload) {
    return this.http.post<Response>(
      `${env.baseUrl}/admin/report/evaluation/postEvaluatedSheet?id=${id}`,
      payload
    );
  }

  getInvigilatorList() {
    return this.http.get<Response>(`${env.baseUrl}/admin/getTeachers`);
  }

  setInvigilator(payload) {
    return this.http.post<Response>(
      `${env.baseUrl}/admin/report/evaluation/assignInvigilator`,
      payload
    );
  }

  getAssignInvigilators(schoolId, teacherId) {
    return this.http.get<Response>(
      `${env.baseUrl}/admin/report/evaluation/assignInvigilator?schoolId=${schoolId}&teacherId${teacherId}`
    );
  }

  getSideMenuItem(roleId) {
    return this.http.get<any>(`${env.api}/getSideMenuItem?roleId=${roleId}`);
  }

  getRoles() {
    return this.http.get<any>(`${env.api}/getRoles`);
  }

  getAllRoles() {
    return this.http.get<any>(`${env.api}/getAllRoles`);
  }
  
  getWebModules() {
    return this.http.get<any>(`${env.api}/getWebModules`);
  }

  updateWebModuleToRole = (body) => {
    return this.http.post<any>(`${env.api}/updateWebModuleToRole`, body);
  };

  // register(user: User) {
  //     return this.http.post(`${env.api}/users/register`, user);
  // }

  // delete(id: number) {
  //     return this.http.delete(`${env.api}/users/${id}`);
  // }

  getUsers(roleId, viewtype, selectfromdate, selecttodate) {
    return this.http.get<any>(
      `${env.api}/getUsers?roleId=${roleId}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}`
    );
  }

  checkEmailAlreadyExist(email) {
    return this.http.get<any>(
      `${env.api}/checkEmailAlreadyExist?email=${email}`
    );
  }

  checkMobileNumberAlreadyExist(mobileNumber) {
    return this.http.get<any>(
      `${env.api}/checkMobileNumberAlreadyExist?mobileNumber=${mobileNumber}`
    );
  }

  saveUser = (body) => {
    return this.http.post<any>(`${env.api}/saveUser`, body);
  };

  getQBSchoolList() {
    return this.http.get<any>(`${env.api}/getqschoollist`);
  }

  getDistrictList() {
    return this.http.get<any>(`${env.api}/getdistrictlist`);
  }

  getQuestionBanks(schoolId, gradeId, mediumId, subjectId, chapterId) {
    return this.http.get<any>(
      `${env.api}/getquestionbanks?schoolId=${schoolId}&gradeId=${gradeId}&mediumId=${mediumId}&subjectId=${subjectId}&chapterId=${chapterId}`
    );
  }

  createTest = (body) => {
    return this.http.post<any>(`${env.api}/createtest`, body);
  };

  getTests(gradeId, mediumId, subjectId, schoolId) {
    return this.http.get<any>(
      `${env.api}/gettests?gradeId=${gradeId}&mediumId=${mediumId}&subjectId=${subjectId}&schoolId=${schoolId}`
    );
  }

  deleteTest = (body) => {
    return this.http.post<any>(`${env.api}/deletetest`, body);
  };

  activatetest = (body) => {
    return this.http.post<any>(`${env.api}/activatetest`, body);
  };

  createSchool = (body) => {
    return this.http.post<any>(`${env.api}/createschool`, body);
  };

  updateSchool = (body) => {
    return this.http.post<any>(`${env.api}/updateschool`, body);
  };

  deleteschool = (body) => {
    return this.http.post<any>(`${env.api}/deleteschool`, body);
  };

  activateschool = (body) => {
    return this.http.post<any>(`${env.api}/activateschool`, body);
  };

  getschoolstudent(schoolId) {
    return this.http.get<any>(
      `${env.api}/getschoolstudent?schoolId=${schoolId}`
    );
  }

  gettestquestions(testId) {
    return this.http.get<any>(`${env.api}/gettestquestions?testId=${testId}`);
  }

  bulkupload = (body) => {
    return this.http.post<any>(`${env.api}/bulkuploadquestions`, body);
  };

  createDivision = (body) => {
    return this.http.post<any>(`${env.api}/createdivision`, body);
  };

  getSchoolDivisions(schoolId) {
    return this.http.get<any>(
      `${env.api}/getschooldivision?schoolId=${schoolId}`
    );
  }

  deleteDivision = (body) => {
    return this.http.post<any>(`${env.api}/deletedivision`, body);
  };

  createTestSeries = (body) => {
    return this.http.post<any>(`${env.api}/createtestseries`, body);
  };

  createCategoryList = (body) => {
    return this.http.post<any>(`${env.api}/addCategory`, body);
  };

  createNewMedia = (body) => {
    return this.http.post<any>(`${env.api}/addMedia`, body);
  };

  updateTestSeries = (body) => {
    return this.http.post<any>(`${env.api}/updatetestseries`, body);
  };

  updateCategoryList = (body, categoryListId) => {
    return this.http.put<any>(
      `${env.api}/updateCategory?_id=${categoryListId}`,
      body
    );
  };
  updateMedia = (body, mediaId) => {
    return this.http.put<any>(`${env.api}/updateMedia?_id=${mediaId}`, body);
  };

  getTestSeries(userType, userId) {
    return this.http.get<any>(
      `${env.api}/gettestseries?userType=${userType}&userId=${userId}`
    );
  }

  getCategoryList(pageIndex, size) {
    return this.http.get<any>(
      `${env.api}/categoryList?pageNumber=${pageIndex}&limit=${size}`
    );
  }
  getAllCategoryList() {
    return this.http.get<any>(`${env.api}/categoryList`);
  }

  getCategorySearchedList(text) {
    return this.http.get<any>(`${env.api}/searchCategory?search=${text}`);
  }

  getenrollPaymentReportSearchedList(
    gradeId,
    mediumId,
    sponsorId,
    schoolIds,
    paymentStatusId,
    viewtype,
    selectfromdate,
    selecttodate,
    text,
    pageIndex,
    pageSize,
  ) {
    return this.http.get<any>(
      `${env.api}/searchEnrollmentPaymentReport?mediumId=${mediumId}&gradeId=${gradeId}&sponsorId=${sponsorId}&schoolIds=${schoolIds}&paymentStatusId=${paymentStatusId}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&search=${text}&pageNumber=${pageIndex}&limit=${pageSize}`
    );
  }

  seneEnrollPaymentReportEmail(
    gradeId,
    mediumId,
    sponsorId,
    schoolIds,
    paymentStatusId,
    viewtype,
    selectfromdate,
    selecttodate,
    email
  ) {
    return this.http.get<any>(
      `${env.api}/mailEnrollmentPaymentReport?mediumId=${mediumId}&gradeId=${gradeId}&sponsorId=${sponsorId}&schoolIds=${schoolIds}&paymentStatusId=${paymentStatusId}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&emailId=${email}`
    );
  }

  getContentUsageReportSearchedList(
    userCategory,
    sponsorId,
    gradeId,
    mediumId,
    schoolIds,
    viewtype,
    selectfromdate,
    selecttodate,
    pageIndex,
    pageSize,
    text
  ) {
    return this.http.get<any>(
      `${env.api}/searchContentUsageReport?userCategory=${userCategory}&sponsorId=${sponsorId}&gradeId=${gradeId}&mediumId=${mediumId}&schoolIds=${schoolIds}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&pageNumber=${pageIndex}&limit=${pageSize}&search=${text}`
    );
  }

  sendContentUsageReportEmail(
    userCategory,
    sponsorId,
    gradeId,
    mediumId,
    schoolIds,
    viewtype,
    selectfromdate,
    selecttodate,
    pageIndex,
    pageSize,
    email
  ) {
    return this.http.get<any>(
      `${env.api}/mailContentUsageReport?userCategory=${userCategory}&sponsorId=${sponsorId}&gradeId=${gradeId}&mediumId=${mediumId}&schoolIds=${schoolIds}&viewtype=${viewtype}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&pageNumber=${pageIndex}&limit=${pageSize}&emailId=${email}`
    );
  }

  getMediaSearchedList(text) {
    return this.http.get<any>(`${env.api}/searchMedia?search=${text}`);
  }

  getMediaList(pageIndex, size) {
    return this.http.get<any>(
      `${env.api}/mediaList?pageNumber=${pageIndex}&limit=${size}`
    );
  }

  getMediaListWithCategoryId(categoryId) {
    return this.http.get<any>(
      `${env.api}/mediaList?exploreModuleId=${categoryId}`
    );
  }

  activateTestSeries = (body) => {
    return this.http.post<any>(`${env.api}/activatetestseries`, body);
  };

  deleteTestSeries = (body) => {
    return this.http.post<any>(`${env.api}/deletetestseries`, body);
  };

  deleteCategory(categoryId) {
    return this.http.patch<any>(
      `${env.api}/actionPerform_category?_id=${categoryId}&status=DELETE`,
      {}
    );
  }

  deleteMedia(mediaId) {
    return this.http.patch<any>(
      `${env.api}/actionPerform_media?_id=${mediaId}&status=DELETE`,
      {}
    );
  }

  deleteExistingTest(mediaId, testId) {
    return this.http.patch<any>(
      `${env.api}/actionPerform_testExplore?testId=${testId}&mediaId=${mediaId}`,
      {}
    );
  }

  getTestSeriesUserList(iTestseriesId) {
    return this.http.get<any>(
      `${env.api}/gettestseriesuserlist?testSeriesId=${iTestseriesId}`
    );
  }

  getTestSeriesStudent(iTestseriesId, iTestPaperId, userType, userId) {
    return this.http.get<any>(
      `${env.api}/gettestseriesstudent?testSeriesId=${iTestseriesId}&testPaperId=${iTestPaperId}&userType=${userType}&userId=${userId}`
    );
  }

  createTestPaper = (body) => {
    return this.http.post<any>(`${env.api}/createtestpaper`, body);
  };

  updateTestPaper = (body) => {
    return this.http.post<any>(`${env.api}/updatetestpaper`, body);
  };
  getTestPaper(iTestseriesId, userType, userId) {
    return this.http.get<any>(
      `${env.api}/gettestpaper?testSeriesId=${iTestseriesId}&userType=${userType}&userId=${userId}`
    );
  }

  deleteTestPaper = (body) => {
    return this.http.post<any>(`${env.api}/deletetestpaper`, body);
  };

  getTestPaperResponse(iTestPaperResponseId) {
    return this.http.get<any>(
      `${env.api}/getTestPaperResponse?testPaperResponseId=${iTestPaperResponseId}`
    );
  }

  uploadUserAnswerSheet = (body) => {
    return this.http.post<any>(`${env.api}/uploadUserAnswerSheet`, body);
  };

  postTestSeriesEvaluationResponse(id, payload) {
    return this.http.post<Response>(
      `${env.api}/postTestSeriesEvaluationResponse?id=${id}`,
      payload
    );
  }

  // uploadUserAnswerSheet(formData: any): Observable<Response> {
  //     return this.http.post<Response>(`${env.baseUrl}/common/uploadFile/QuestionPapers`, formData);
  // }

  activateUser = (body) => {
    return this.http.post<any>(`${env.api}/activateUser`, body);
  };

  deleteUser = (body) => {
    return this.http.post<any>(`${env.api}/deleteUser`, body);
  };

  getExamManagementResponse(id) {
    return this.http.get<any>(`${env.api}/getTestRecords?testId=${id}`);
  }

  bulkuploadTestSeriesPaper = (body) => {
    return this.http.post<any>(`${env.api}/bulkUploadTestPaper`, body);
  };

  getTeacherUsers(gradeId, mediumId, subjectId, schoolId) {
    return this.http.get<any>(
      `${env.api}/getTeacherUsers?schoolId=${schoolId}&gradeId=${gradeId}&mediumId=${mediumId}&subjectId=${subjectId}`
    );
  }

  getTeacherListGradeMediumWise(gradeId, mediumId) {
    return this.http.get<any>(
      `${env.api}/getTeacherListGradeMediumWise?gradeId=${gradeId}&mediumId=${mediumId}`
    );
  }

  postAssignTeacher(payload) {
    return this.http.post<any>(`${env.api}/postAssignTeacher`, payload);
  }

  getAssignedDataTeacher(testSeriesId, teacherId) {
    return this.http.get<any>(
      `${env.api}/getAssignedDataTeacher?testSeriesId=${testSeriesId}&teacherId${teacherId}`
    );
  }

  getVyakhyanmala(gradeId, mediumId) {
    return this.http.get<any>(
      `${env.api}/getVyakhyanmala?gradeId=${gradeId}&mediumId=${mediumId}`
    );
  }

  vyakhyanmalaBulkupload = (body) => {
    return this.http.post<any>(`${env.api}/vyakhyanmalaBulkupload`, body);
  };

  deleteVyakhyanmala = (body) => {
    return this.http.post<any>(`${env.api}/deleteVyakhyanmala`, body);
  };

  getSchoolUsers(gradeId, schoolId, mediumId, userType) {
    return this.http.get<any>(
      `${env.api}/getSchoolUsers?schoolId=${schoolId}&mediumId=${mediumId}&gradeId=${gradeId}&userType=${userType}`
    );
  }

  createscholarship = (body) => {
    return this.http.post<any>(`${env.api}/createscholarship`, body);
  };

  updatescholarship = (body) => {
    return this.http.post<any>(`${env.api}/updatescholarship`, body);
  };

  getscholarship(userType, userId) {
    return this.http.get<any>(
      `${env.api}/getscholarship?userType=${userType}&userId=${userId}`
    );
  }

  activatescholarship = (body) => {
    return this.http.post<any>(`${env.api}/activatescholarship`, body);
  };

  deletescholarship = (body) => {
    return this.http.post<any>(`${env.api}/deletescholarship`, body);
  };

  getscholarshipUserList(ischolarshipId) {
    return this.http.get<any>(
      `${env.api}/getscholarshipuserlist?scholarshipId=${ischolarshipId}`
    );
  }

  getscholarshipStudent(ischolarshipId, iTestPaperId, userType, userId) {
    return this.http.get<any>(
      `${env.api}/getscholarshipstudent?scholarshipId=${ischolarshipId}&testPaperId=${iTestPaperId}&userType=${userType}&userId=${userId}`
    );
  }

  createTestPaperscholarship = (body) => {
    return this.http.post<any>(`${env.api}/createtestpaperscholarship`, body);
  };

  updateTestPaperscholarship = (body) => {
    return this.http.post<any>(`${env.api}/updatetestpaperscholarship`, body);
  };
  getTestPaperscholarship(ischolarshipId, userType, userId) {
    return this.http.get<any>(
      `${env.api}/gettestpaperscholarship?scholarshipId=${ischolarshipId}&userType=${userType}&userId=${userId}`
    );
  }

  deleteTestPaperscholarship = (body) => {
    return this.http.post<any>(`${env.api}/deletetestpaperscholarship`, body);
  };

  getscholarshipTestPaperResponse(iTestPaperResponseId) {
    return this.http.get<any>(
      `${env.api}/getscholarshipTestPaperResponse?testPaperResponseId=${iTestPaperResponseId}`
    );
  }

  uploadUserAnswerSheetscholarship = (body) => {
    return this.http.post<any>(
      `${env.api}/uploadUserAnswerSheetscholarship`,
      body
    );
  };

  postscholarshipEvaluationResponse(id, payload) {
    return this.http.post<Response>(
      `${env.api}/postscholarshipEvaluationResponse?id=${id}`,
      payload
    );
  }

  bulkuploadscholarshipPaper = (body) => {
    return this.http.post<any>(
      `${env.api}/bulkUploadTestPaperscholarship`,
      body
    );
  };

  getscholarshipSubject(gradeId, mediumId) {
    return this.http.get<any>(
      `${env.api}/getscholarshipSubject?gradeId=${gradeId}&mediumId=${mediumId}`
    );
  }

  postAssignTeacherscholarship(payload) {
    return this.http.post<any>(
      `${env.api}/postAssignTeacherscholarship`,
      payload
    );
  }

  uploadTestSheet(file): Observable<any> {
    // Create form data
    const formData = new FormData();

    formData.append("file", file, file.name);

    return this.http.post(`${env.api}/bulkUploadTestSheet`, formData);
  }

  getContentMapping() {
    return this.http.get<any>(`${env.api}/getContentMapping`);
  }

  updateContentMediums = (body) => {
      return this.http.post<any>(`${env.api}/updateContentMediums`, body);
  }


  deleteMapping = (body) => {
      return this.http.post<any>(`${env.api}/deleteContentMapping`, body);
  }

  createCompetition = (body) => {
      return this.http.post<any>(`${env.api}/createCompetition`, body);
  }


  updateCompetition = (body) => {
      return this.http.post<any>(`${env.api}/updateCompetition`, body);
  }


  getCompetition() {
      return this.http.get<any>(`${env.api}/getCompetition`);
  }


  activateCompetition = (body) => {
      return this.http.post<any>(`${env.api}/activateCompetition`, body);
  }

  activateCompetitionByAccess = (body) => {
    return this.http.post<any>(`${env.api}/activateCompetitionByAccess`, body);
  }


  bulkUploadSchoolsForCompetitions = (body) => {
    return this.http.post<any>(`${env.api}/bulkUploadSchoolsForCompetitions`, body);
  }

  deleteCompetition = (body) => {
      return this.http.post<any>(`${env.api}/deleteCompetition`, body);
  }

  removeSchoolFromCompetition = (body) => {
    return this.http.post<any>(`${env.api}/removeSchoolFromCompetition`, body);
  }
  
  publishResult = (body) => {
      return this.http.post<any>(`${env.api}/publishResult`, body);
  }

  publishRank = (body) => {
      return this.http.post<any>(`${env.api}/publishRank`, body);
  }

  updateCompetitionSettings = (body) => {
    return this.http.post<any>(`${env.api}/updateCompetitionSettings`, body);
}

  bulkuploadCompetitionQuestions = (body) => {
      return this.http.post<any>(`${env.api}/bulkuploadCompetitionQuestions`, body);
  }

  deleteCompetitionQuestion = (body) => {
      return this.http.post<any>(`${env.api}/deleteCompetitionQuestion`, body);
  }

  getCompetitionQuestions(competitionId) {
      return this.http.get<any>(`${env.api}/getCompetitionQuestions?competitionId=${competitionId}`);
  }

  getCompetitionStudent(competitionId) {
      return this.http.get<any>(`${env.api}/getCompetitionStudent?competitionId=${competitionId}`);
  }

  getCompetitionAccessSchools(competitionId) {
    return this.http.get<any>(`${env.api}/getCompetitionAccessSchools?competitionId=${competitionId}`);
  }

  getCompetitionEnrollStudent(competitionId) {
      return this.http.get<any>(`${env.api}/getCompetitionEnrollStudent?competitionId=${competitionId}`);
  }
  
  sendCompetitionsNotifications = (body) => {
    return this.http.post<any>(`${env.api}/sendNotificationsToCompetitionsStudent`, body);
  }

  getCompetitionNotifications(competitionId) {
    return this.http.get<any>(`${env.api}/getCompetitionNotifications?competitionId=${competitionId}`);
  }

  resendNotificationsToCompetitionsStudent = (body) => {
    return this.http.post<any>(`${env.api}/resendNotificationsToCompetitionsStudent`, body);
  }

  getCompetitionDataQuestionWise(competitionId) {
    return this.http.get<any>(`${env.api}/getCompetitionDataQuestionWise?competitionId=${competitionId}`);
  }

  getCompetitionDataUserResponseWise(competitionId) {
    return this.http.get<any>(`${env.api}/getCompetitionDataUserResponseWise?competitionId=${competitionId}`);
  }

  getRoleCostManageData() {
    return this.http.get<any>(`${env.api}/getRoleCostManageData`);
  }


  updateRoleCost = (body) => {
    return this.http.post<any>(`${env.api}/updateRoleCost`, body);
  }


  getReferralUsers() {
    return this.http.get<any>(`${env.api}/getReferralCodeUsers`);
  }

  referralUsersBulkupload = (body) => {
    return this.http.post<any>(`${env.api}/referralUsersBulkupload`, body);
  };


  activateReferralCode = (body) => {
    return this.http.post<any>(`${env.api}/activateReferralCode`, body);
  };

  deleteReferralUsers = (body) => {
    return this.http.post<any>(`${env.api}/deleteReferralUsers`, body);
  };

  getReferralCodeActivateUserList(iSalepersonId,viewtype,selectfromdate,selecttodate, pageIndex,pageSize) {
    return this.http.get<any>(
      `${env.api}/getReferralCodeActivateUserList?viewtype=${viewtype}&salepersonId=${iSalepersonId}&selectfromdate=${selectfromdate}&selecttodate=${selecttodate}&pageNumber=${pageIndex}&limit=${pageSize}`
    );
  }

  updateReferralCode = (body) => {
    return this.http.post<any>(`${env.api}/updateReferralCode`, body);
  };


  searchSchoolbyUdiseCode(schoolcode) {
    return this.http.get<any>(`${env.api}/searchSchoolbyUdiseCode?schoolcode=${schoolcode}`);
  }
 
  activateVerifySchool = (body) => {
    return this.http.post<any>(`${env.api}/activateVerifySchool`, body);
  };

  bulkuploadSchoolStudentLinkup = (body) => {
    return this.http.post<any>(`${env.api}/bulkuploadSchoolStudentLinkup`, body);
 }
}
