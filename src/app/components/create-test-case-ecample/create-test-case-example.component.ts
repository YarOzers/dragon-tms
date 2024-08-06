import {Component, signal, ViewChild} from '@angular/core';
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
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";

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
    MatIcon,
    MatSidenavContainer,
    MatNavList,
    MatListItem,
    MatSidenavModule,
  ],
  templateUrl: './create-test-case-example.component.html',
  styleUrl: './create-test-case-example.component.css'
})
export class CreateTestCaseExampleComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  allSelectedSteps = false;
  allSelectedPreConditions = false;
  allSelectedPostConditions = false;
  indeterminateSteps = false;
  indeterminatePreCondition = false;
  indeterminatePostCondition = false;

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


  toggleSidenav() {
    this.sidenav.toggle();
  }

addStep(){
    const step: TestCaseStep = {
      id: this.steps.length +1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.steps.push(step);
    this.updateAllSelectedSteps();
}

  addPreCondition(){
    const preCondition: TestCasePreCondition = {
      id: this.preconditions.length +1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.preconditions.push(preCondition);
    this.updateAllSelectedPreconditions();
  }

  addPostCondition(){
    const postCondition: TestCasePostCondition = {
      id: this.postConditions.length +1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.postConditions.push(postCondition);
    this.updateAllSelectedPostConditions();
  }

  deleteSelectedSteps() {
    this.steps = this.steps.filter(step => !step.selected);
    this.updateAllSelectedSteps();
    this.allSelectedSteps = false;
  }

  selectAllSteps(checked: boolean) {
    this.steps.forEach(step => step.selected = checked);
    this.allSelectedSteps = checked;
  }

  updateAllSelectedSteps() {
    const totalSelected = this.steps.filter(step => step.selected).length;
    this.allSelectedSteps = totalSelected === this.steps.length;
    this.indeterminateSteps = totalSelected > 0 && totalSelected < this.steps.length;
  }

  autoResize(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  }

  selectAllPreconditions(checked: boolean) {
    this.preconditions.forEach(step => step.selected = checked);
    this.allSelectedPreConditions = checked;
  }

  updateAllSelectedPreconditions() {
    const totalSelected = this.preconditions.filter(step => step.selected).length;
    this.allSelectedPreConditions = totalSelected === this.preconditions.length;
    this.indeterminatePreCondition = totalSelected > 0 && totalSelected < this.preconditions.length;
  }

  deleteSelectedPreconditions() {
    this.preconditions = this.preconditions.filter(step => !step.selected);
    this.updateAllSelectedPreconditions();
    this.allSelectedPreConditions = false;
  }

  selectAllPostConditions(checked: boolean) {
    this.postConditions.forEach(step => step.selected = checked);
    this.allSelectedPostConditions = checked;
  }

  updateAllSelectedPostConditions() {
    const totalSelected = this.steps.filter(step => step.selected).length;
    this.allSelectedPostConditions = totalSelected === this.postConditions.length;
    this.indeterminatePostCondition = totalSelected > 0 && totalSelected < this.postConditions.length;
  }

  deleteSelectedPostConditions() {
    this.postConditions = this.postConditions.filter(step => !step.selected);
    this.updateAllSelectedPostConditions();
    this.allSelectedPostConditions = false;
  }
}
