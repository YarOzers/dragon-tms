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
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";

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
    MatFormField,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    MatInput
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
  protected typeOf: 'testCase' | 'checkList' = 'testCase';
  protected name: string = '';
  protected steps: TestCaseStep[] = [this.step];
  protected preconditions: TestCasePreCondition[] = [this.preCondition];
  protected postConditions: TestCasePostCondition[] = [this.postCondition];
  private testCaseId = 1;
  private folderName = '';
  private folderId: null = null;
  protected typeOfTest: string | null = null;
  protected type: 'functional' | 'system' | 'performance' | 'regression' | 'unit' | 'security' | 'localization' | 'usability' | null = null;
  protected automationFlag: 'auto' | 'manual' | null = null;
  protected executionTime: string | null = '00:00';
  protected status: 'ready' | 'not ready' | 'requires updating' = 'not ready';
  private data: TestCaseData = {
    status: this.status,
    automationFlag: this.automationFlag,
    changesAuthor: this.user,
    createdTime: null,
    executionTime: null,
    expectedExecutionTime: this.executionTime,
    name: this.name,
    preConditionItems: this.preconditions,
    stepItems: this.steps,
    postConditionItems: this.postConditions,
    priority: null,
    type: this.type,
    version: 1
  }
  protected testCase: TestCase = {
    id: this.testCaseId,
    name: this.name,
    folderId: this.folderId,
    folder: this.folderName,
    type: this.typeOf,
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
  private reorderPreConditions() {
    this.preconditions.forEach((step, index) => {
      step.id = index + 1;
    });
  }

  private reorderSteps() {
    this.steps.forEach((step, index) => {
      step.id = index + 1;
    });
  }

  private reorderPostConditions() {
    this.postConditions.forEach((step, index) => {
      step.id = index + 1;
    });
  }
  addStep() {
    const step: TestCaseStep = {
      id: this.steps.length + 1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.steps.push(step);
    this.updateAllSelectedSteps();
  }

  addPreCondition() {
    const preCondition: TestCasePreCondition = {
      id: this.preconditions.length + 1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.preconditions.push(preCondition);
    this.updateAllSelectedPreconditions();
  }

  addPostCondition() {
    const postCondition: TestCasePostCondition = {
      id: this.postConditions.length + 1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.postConditions.push(postCondition);
    this.updateAllSelectedPostConditions();
  }

  deleteSelectedSteps() {
    this.steps = this.steps.filter(step => !step.selected);
    this.reorderSteps();
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
    this.reorderPreConditions();
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
    this.reorderPostConditions();
    this.updateAllSelectedPostConditions();
    this.allSelectedPostConditions = false;
  }


//   Sidenav ===========================================================

  typesOfTests = [
    'functional',
    'system',
    'performance',
    'regression',
    'unit',
    'security',
    'localization',
    'usability'
  ];
  typesOfPriority = [
    'Highest',
    'High',
    'Medium',
    'Low'
  ];

  automationFlags = [
    'auto',
    'manual'
  ]

  statuses = [
    'ready' ,
    'not ready' ,
    'requires updating'
  ]

}


