import { Component } from '@angular/core';
import {
  TestCase,
  TestCaseData,
  TestCasePostCondition,
  TestCasePreCondition,
  TestCaseStep
} from "../../models/test-case";
import {User} from "../../models/user";

@Component({
  selector: 'app-create-test-case-ecample',
  standalone: true,
  imports: [],
  templateUrl: './create-test-case-example.component.html',
  styleUrl: './create-test-case-example.component.css'
})
export class CreateTestCaseExampleComponent {
  private user: User = {
    id: 1,
    role: 'admin',
    name: 'Ярослав Андреевич',
    rights: 'super'
  }

  private preCondition: TestCasePreCondition = {
    id: 1,
    selected: false,
    action: '',
    expectedResult: ''
  }

  private step: TestCaseStep = {
    id: 1,
    selected: false,
    action: '',
    expectedResult: ''
  }

  private postCondition: TestCasePostCondition = {
    id: 1,
    selected: false,
    action: '',
    expectedResult: ''
  }
  private steps: TestCaseStep[] = [this.step];
  private preconditions: TestCasePreCondition[] = [this.preCondition];
  private postConditions: TestCasePostCondition[] = [this.postCondition];
  private testCaseId = 1;
  private folderName = '';
  private data: TestCaseData = {
    automationFlag: null,
    changesAuthor: this.user,
    createdTime: null,
    executionTime:  null,
    expectedExecutionTime:  null,
    name: '',
    preConditionItems:  this.preconditions,
    stepItems: this.steps,
    postConditionItems: this.postConditions,
    priority: null,
    type: null,
    version: 1
  }
  private testCase: TestCase = {
    id: this.testCaseId,
    name: '',
    folder: this.folderName,
    type: 'testCase',
    author: this.user,
    data: [this.data],
    loading: null,
    new: true,
    results: null,
    selected: null
  }




}
