import { Injectable } from '@angular/core';
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TestCase} from "../models/test-case";
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
}
