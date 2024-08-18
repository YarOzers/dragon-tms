import { Injectable } from '@angular/core';
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TestCase, TestCaseData} from "../models/test-case";
import {Folder} from "../models/folder";

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getTestCasesInFolder(folderId: number): Observable<TestCase[]> {

    const testCases = this.http.get<TestCase[]>(`${this.apiUrl}/testcases/${folderId}`, );
    console.log(`Get testCases in folder ${folderId} : ${testCases}`);

    return testCases;
  }

  addTestCaseToFolder(folderId: number, testCase: TestCase):Observable<TestCase>{
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
}
