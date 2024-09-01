import { Injectable } from '@angular/core';
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestRunnerServiceService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  runTests(testIds: number[]): Observable<any>{
    return this.http.post(`${this.apiUrl}/run-tests`,{testIds});
  }
}
