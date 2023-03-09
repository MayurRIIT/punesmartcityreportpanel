import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getGrade() {
    return this.http.get<any>(`${env.baseUrl}/user/grade`);
  }

  getState() {
    return this.http.get<any>(`${env.baseUrl}/admin/getState`);
  }

  getDistrict() {
    return this.http.get<any>(`${env.baseUrl}/user/getDistrict`);
  }

  getMedium() {
    return this.http.get<any>(`${env.baseUrl}/user/medium`);
  }

  getSchools(payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/getSchoolListByDistrict`,payload);
  }

  getAdminDashboardProgressReport(startDate, endDate, payload, pageIndex, pageSize) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/admindashboardprogress?startDate=${startDate}&endDate=${endDate}&pageNumber=${pageIndex}&limit=${pageSize}`, payload);
  }

  getgradewiseschoolreport(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getgradewiseschoolreport?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  getDivisionDataSpecificGradeSchoolDashboard(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getDivisionDataSpecificGradeSchoolDashboard?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  getSubjectDataSpecificGradeSchoolDashboard(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getSubjectDataSpecificGradeSchoolDashboard?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  getChapterDataSpecificGradeSchoolDashboard(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getChapterDataSpecificGradeSchoolDashboard?startDate=${startDate}&endDate=${endDate}`, payload);
  }
  
  getSpecificChapterProgressDataSchoolDashboard(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getSpecificChapterProgressDataSchoolDashboard?startDate=${startDate}&endDate=${endDate}`, payload);
  }
  
  getSchoolDashboardProgressReport(startDate, endDate, payload, pageIndex, pageSize) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getSchoolDashboardProgressReport?startDate=${startDate}&endDate=${endDate}&pageNumber=${pageIndex}&limit=${pageSize}`, payload);
  }

  // getGradeWiseMaleFemaleCount(startDate, endDate, payload) {
  //   return this.http.post<any>(`${env.baseUrl}/admin/report/getGradeWiseMaleFemaleCount?startDate=${startDate}&endDate=${endDate}`, payload);
  // }


  getDistrictWiseMaleFemaleCount(payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getDistrictWiseMaleFemaleCount`, payload);
  }

  generateCharts(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/admindashboard?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  generateUserContentReport(startDate, endDate, payload, pageIndex, pageSize) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/userContent?startDate=${startDate}&endDate=${endDate}&pageNumber=${pageIndex}&limit=${pageSize}`, payload);
  }

  generateUserContentChart(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/userContent?startDate=${startDate}&endDate=${endDate}`, payload);
  }

}
