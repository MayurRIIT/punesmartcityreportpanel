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

  getGradeWiseGenderCount(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getGradeWiseGenderCount?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  getGradeWiseMediumCount(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getGradeWiseMediumCount?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  getGradeWiseRoleCount(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getGradeWiseRoleCount?startDate=${startDate}&endDate=${endDate}`, payload);
  }


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

  getAdminDashboardSchoolReport(startDate, endDate, payload, pageIndex, pageSize) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getAdminDashboardSchoolReport?startDate=${startDate}&endDate=${endDate}&pageNumber=${pageIndex}&limit=${pageSize}`, payload);
  }
  
  getTop5SchoolResultGenderWise(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getTop5SchoolResultGenderWise?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  getTop5SchoolResultMediumWise(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getTop5SchoolResultMediumWise?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  getIncreasedPercentageOfGenderWise(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getIncreasedPercentageOfGenderWise?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  getIncreasedPercentageOfRoleWise(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getIncreasedPercentageOfRoleWise?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  getIncreasedPercentageOfMediumWise(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/getIncreasedPercentageOfMediumWise?startDate=${startDate}&endDate=${endDate}`, payload);
  }

}
