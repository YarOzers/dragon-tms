import {Component, signal} from '@angular/core';
import {
  TestCase,
  TestCaseData,
  TestCasePostCondition,
  TestCasePreCondition,
  TestCaseStep
} from "../../models/test-case";
import {User} from "../../models/user";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import {FlexModule} from "@angular/flex-layout";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-create-test-case-ecample',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    MatButton,
    MatCheckbox,
    FlexModule,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './create-test-case-example.component.html',
  styleUrl: './create-test-case-example.component.css'
})
export class CreateTestCaseExampleComponent {
  allSelected = false;
  indeterminate = false;

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
  protected steps: TestCaseStep[] = [this.step];
  protected preconditions: TestCasePreCondition[] = [this.preCondition];
  protected postConditions: TestCasePostCondition[] = [this.postCondition];
  private testCaseId = 1;
  private folderName = '';
  private folderId: null = null;
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
  protected testCase: TestCase = {
    id: this.testCaseId,
    name: '',
    folderId: this.folderId,
    folder: this.folderName,
    type: 'testCase',
    author: this.user,
    data: [this.data],
    loading: null,
    new: true,
    results: null,
    selected: null
  }


addStep(){
    const step: TestCaseStep = {
      id: this.steps.length +1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.steps.push(step);
    this.updateAllSelected();
}

  addPreCondition(){
    const preCondition: TestCasePreCondition = {
      id: this.steps.length +1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.steps.push(preCondition);
    this.updateAllSelected();
  }

  addPostCondition(){
    const postCondition: TestCasePostCondition = {
      id: this.steps.length +1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.steps.push(postCondition);
    this.updateAllSelected();
  }

  deleteSelectedSteps() {
    this.steps = this.steps.filter(step => !step.selected);
    this.updateAllSelected();
  }

  selectAllSteps(checked: boolean) {
    this.steps.forEach(step => step.selected = checked);
    this.allSelected = checked;
  }

  updateAllSelected() {
    const totalSelected = this.steps.filter(step => step.selected).length;
    this.allSelected = totalSelected === this.steps.length;
    this.indeterminate = totalSelected > 0 && totalSelected < this.steps.length;
  }

  autoResize(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  }

}
