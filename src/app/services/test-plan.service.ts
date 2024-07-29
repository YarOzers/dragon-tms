import { Injectable } from '@angular/core';
import {TestPlan} from "../models/test-plan";
import {User} from "../models/user";
import {Folder} from "../models/folder";
import {delay, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestPlanService {

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



  constructor() { }
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

  getTestPlan(): Observable<TestPlan[]> {
    return of(this._testPlans).pipe(delay(500)); // Симуляция задержки
  }


  createTestPlan(project: TestPlan): Observable<TestPlan> {
    project.createdDate = this.getCurrentDateTimeString();
    project.id = this.nextId++;
    this._testPlans.push(project);

    return of(project).pipe(delay(500)); // Симуляция задержки
  }


  updateTestPlan(project: TestPlan): Observable<TestPlan> {
    const index = this._testPlans.findIndex(p => p.id === project.id);
    if (index !== -1) {
      this._testPlans[index] = project;
    }
    return of(project).pipe(delay(500)); // Симуляция задержки
  }


  deleteTestPlan(id: number): Observable<void> {
    this._testPlans = this._testPlans.filter(project => project.id !== id);
    return of(undefined).pipe(delay(500)); // Симуляция задержки
  }


  get testPlan(): TestPlan[] {
    return this._testPlans;
  }


  set testPlan(value: TestPlan[]) {
    this._testPlans = value;
  }
}
