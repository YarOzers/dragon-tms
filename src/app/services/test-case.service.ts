import { Injectable } from '@angular/core';
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TestCase, TestCaseData, TestCaseResult} from "../models/test-case";
import {Folder} from "../models/folder";

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getTestCasesInFolder(folderId: number): Observable<TestCase[]> {

    const testCases = this.http.get<TestCase[]>(`${this.apiUrl}/testcases/${folderId}`);
    console.log(`Get testCases in folder ${folderId} : ${testCases}`);
    const test = testCases;
    test.subscribe(testCases=>{
      console.log("GETtestCases:  ", testCases);
    })

    return testCases;
  }

  addTestCaseToFolder(folderId: number, testCase: TestCase):Observable<TestCase>{
    console.log("Add testCaseToFolder was executed, testCase::", testCase);
    return this.http.post<TestCase>(`${this.apiUrl}/testcases/folder/${folderId}`,testCase)
  }

  updateTestCase(testCaseId: number, testCaseDate: TestCaseData): Observable<TestCase>{
    return this.http.put<TestCase>(`${this.apiUrl}/testcases/${testCaseId}`,testCaseDate);
  }

  moveTestCase(testCaseId: number, targetFolderId: number):Observable<TestCase>{
    return this.http.put<TestCase>(`${this.apiUrl}/${testCaseId}/move/${targetFolderId}`, null);
  }

  copyTestCase(testCaseId: number, targetFolderId: number): Observable<TestCase>{
    return this.http.post<TestCase>(`${this.apiUrl}/${testCaseId}/copy/${targetFolderId}`,null);
  }

  deleteTestCase(testCaseId:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${testCaseId}`);
  }

  getTestCase(testCaseId: number): Observable<TestCase>{
    return  this.http.get<TestCase>(`${this.apiUrl}/testcases/testcase/${testCaseId}`)
  }

  getAllTestCases(folderId: number): Observable<Folder[]>{
    return  this.http.get<Folder[]>(`${this.apiUrl}/testcases/folder/${folderId}/all`)
  }

  setTestCaseResult(testCaseId: number, testCaseResult: TestCaseResult): Observable<TestCase> {
    return this.http.post<TestCase>(`${this.apiUrl}/testcases/setresult/${testCaseId}`, testCaseResult)

  }


}
