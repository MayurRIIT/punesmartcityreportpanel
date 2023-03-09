import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DailySummaryService {

  constructor(private http: HttpClient) { }

  getSummaryReport(endPoint) {
    return this.http.get<any>(`${env.baseUrl}/admin/report/summary/${endPoint}`);
  }

  getSummaryReportWithDateRange(endPoint, startDate, endDate) {
    return this.http.get<any>(`${env.baseUrl}/admin/report/summary/${endPoint}?startDate=${startDate}&endDate=${endDate}`);
  }

  getBestStudent(endPoint, startDate, endDate) {
    return this.http.get<any>(`${env.baseUrl}/admin/report/summary/${endPoint}?startDate=${startDate}&endDate=${endDate}`);
  }

}
