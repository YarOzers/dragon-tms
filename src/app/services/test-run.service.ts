import { Injectable } from '@angular/core';
import {environment} from "../environment";
import {Observable} from "rxjs";
import {TestRunsComponent} from "../components/test-runs/test-runs.component";
import {HttpClient, HttpParams} from "@angular/common/http";
import {TestRun} from "../models/test-run";

@Injectable({
  providedIn: 'root'
})
export class TestRunService {

  private apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getProjectTestRuns(projectId: number) : Observable<TestRun[]>{
    let params: HttpParams = new HttpParams()
      .set('projectId', projectId);
    return this.httpClient.get<TestRun[]>(`${this.apiUrl}/run-tests`, {params: params})
  }
}
