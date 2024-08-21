import {Injectable} from '@angular/core';
import {TestPlan} from "../models/test-plan";
import {User} from "../models/user";
import {Folder} from "../models/folder";
import {delay, Observable, of} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})
export class TestPlanService {

  private apiUrl = environment.apiUrl;

  private _testPlans: TestPlan[] = [{
    id: 1,
    name: 'first test plan',
    createdDate: this.getCurrentDateTimeString(),
    author: 'author',
    startDate: 'start-date',
    finishDate: 'finish-date',
    testCaseCount: 0,
    status: 'await',
    qas: [],
    folders: []
  }];

  private nextId = 1;


  constructor(
    private http: HttpClient
  ) {
  }

  getCurrentDateTimeString(): string {
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  get testPlan(): TestPlan[] {
    return this._testPlans;
  }


  set testPlan(value: TestPlan[]) {
    this._testPlans = value;
  }

  getTestPlansByProjectId(projectId: number): Observable<TestPlan[]> {
    return this.http.get<TestPlan[]>(`${this.apiUrl}/testplans/project/${projectId}`)

  }

  createTestPlan(testPlanName: string, userId: number, projectId: number): Observable<TestPlan> {
    let requestParam: HttpParams = new HttpParams()
      .set('name', testPlanName)
      .set('userId', userId)
      .set('projectId', projectId);
    return this.http.post<TestPlan>(`${this.apiUrl}/testplans/create`, null, {params: requestParam})
  }

  addTestCasesToTestPlan(testPlanId: number, testCaseIds: number[]):Observable<string>{
    return this.http.post(`${this.apiUrl}/testplans/${testPlanId}/test-cases`,testCaseIds,{ responseType: 'text' })
  }

  getFoldersForTestCasesInTestPlan(testPlanId: number): Observable<Folder>{
    return this.http.get<Folder>(`${this.apiUrl}/testplans/${testPlanId}/folders`)
  }

  getTestPlan(testPlanId: number): Observable<TestPlan>{
    return  this.http.get<TestPlan>(`${this.apiUrl}/testplans/${testPlanId}`)
  }
}
