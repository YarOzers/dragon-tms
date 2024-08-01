import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RouterParamsService {

  constructor() { }
  private projectIdSource = new BehaviorSubject<number | null>(null);
  private testPlanIdSource = new BehaviorSubject<number | null>(null);

  projectId$ = this.projectIdSource.asObservable();
  testPlanId$ = this.testPlanIdSource.asObservable();

  setProjectId(id: number | null) {
    this.projectIdSource.next(id);
  }

  setTestPlanId(id: number | null) {
    this.testPlanIdSource.next(id);
  }
}
