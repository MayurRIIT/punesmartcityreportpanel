import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getGrade() {
    return this.http.get<any>(`${env.baseUrl}/user/grade`);
  }

  getMedium() {
    return this.http.get<any>(`${env.baseUrl}/user/medium`);
  }

  getSchools() {
    return this.http.get<any>(`${env.baseUrl}/user/school`);
  }

  generateDashboardReport(startDate, endDate, payload, pageIndex, pageSize) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/dashboard?startDate=${startDate}&endDate=${endDate}&pageNumber=${pageIndex}&limit=${pageSize}`, payload);
  }

  generateCharts(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/dashboard?startDate=${startDate}&endDate=${endDate}`, payload);
  }

  generateUserContentReport(startDate, endDate, payload, pageIndex, pageSize) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/userContent?startDate=${startDate}&endDate=${endDate}&pageNumber=${pageIndex}&limit=${pageSize}`, payload);
  }

  generateUserContentChart(startDate, endDate, payload) {
    return this.http.post<any>(`${env.baseUrl}/admin/report/userContent?startDate=${startDate}&endDate=${endDate}`, payload);
  }

}
