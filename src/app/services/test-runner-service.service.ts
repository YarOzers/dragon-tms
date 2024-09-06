import { Injectable } from '@angular/core';
import {environment} from "../environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestRunnerServiceService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  runTests(testIds: number[], userId: number, testPlanId: number): Observable<any>{
    console.log("RUN TESTS!!!!!")
    console.log("TEstIDS::",testIds)
   let params: HttpParams = new HttpParams()
     .set("userId", userId)
     .set("testPlanId", testPlanId);
    return this.http.post(`${this.apiUrl}/run-tests`,testIds, {params: params});
  }
}
