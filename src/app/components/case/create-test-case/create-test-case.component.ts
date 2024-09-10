import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {FlexModule} from "@angular/flex-layout";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatError, MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgClass, NgForOf, NgIf, NgSwitchCase} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {User} from "../../../models/user";
import {
  TestCase,
  TestCaseData,
  TestCasePostCondition,
  TestCasePreCondition,
  TestCaseResult,
  TestCaseStep
} from "../../../models/test-case";
import {ProjectService} from "../../../services/project.service";
import {MatProgressBar} from "@angular/material/progress-bar";
import {RouterParamsService} from "../../../services/router-params.service";
import {TestCaseService} from "../../../services/test-case.service";
import {ImageDialogComponent} from "./image-dialog/image-dialog.component";
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-create-test-case',
  standalone: true,
  host: {style: '--mdc-dialog-container-shape: 0px'},
  imports: [
    FlexModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    NgSwitchCase,
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    MatMiniFabButton,
    MatOption,
    MatSelect,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    NgClass,
    MatProgressBar,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionModule,
    NgxMaskDirective,
    MatFormFieldModule
  ],
  providers: [provideNgxMask()],
  templateUrl: './create-test-case.component.html',
  styleUrls: [
    './create-test-case.component.scss',
    './create-test-case-example.component.css',
    './editor.component.css'
  ]
})
export class CreateTestCaseComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('editorPreConditionContainer', {static: true}) editorPreConditionContainer: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('editorStepContainer', {static: true}) editorStepContainer: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('editorPostConditionContainer', {static: true}) editorPostConditionContainer: ElementRef<HTMLDivElement> | undefined;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('actionEditor') actionEditor!: ElementRef;


  //////////////////////////////////////////////////////////////////
  protected hasChange: boolean = false;
  elementWidth!: number;
  private resizeObserver!: ResizeObserver;
  progressBar: boolean = false;
  protected versions: any[] = [];
  protected version: any;
  protected selectedVersion: any;


  // Массив редакторов, представляющий количество редакторов

  // Объект для отслеживания текущих примененных стилей
  currentStyles: { [key: string]: boolean } = {
    bold: false,
    italic: false,
    underline: false,
    'color-red': false,
    'color-green': false,
    'color-black': false
  };

  // Новый объект для отслеживания текущих примененных классов
  currentClasses: { [key: string]: boolean } = {
    highlight: false,
    underline: false
  };

  // ViewChild позволяет получить доступ к элементу DOM через Angular

  // Текущий активный редактор
  activeEditor: HTMLElement | null = null;
  // Сохраненный диапазон выделения текста
  private savedRange: Range | null = null;

///////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  allSelectedSteps = false;
  allSelectedPreConditions = false;
  allSelectedPostConditions = false;
  indeterminateSteps = false;
  indeterminatePreCondition = false;
  indeterminatePostCondition = false;

  private user: User = {
    id: 0,
    roles: [],
    name: '',
    email: ''
  }

  private preCondition: TestCasePreCondition = {
    index: 1,
    selected: false,
    action: '',
    expectedResult: ''
  }

  private step: TestCaseStep = {
    index: 1,
    selected: false,
    action: '',
    expectedResult: ''
  }

  private postCondition: TestCasePostCondition = {
    index: 1,
    selected: false,
    action: '',
    expectedResult: ''
  }
  protected typeOf: any = 'TESTCASE';
  protected name: string = '';
  protected steps: TestCaseStep[] = [this.step];
  protected preConditions: TestCasePreCondition[] = [this.preCondition];
  protected postConditions: TestCasePostCondition[] = [this.postCondition];
  protected testCaseId = 0;
  private folderName = '';
  private folderId: number | null = null;
  protected type: 'functional' | 'system' | 'performance' | 'regression' | 'unit' | 'security' | 'localization' | 'usability' | null = null;
  protected automationFlag: 'auto' | 'manual' | null = null;
  protected executionTime: string | null = '00:00';
  protected status: 'ready' | 'not ready' | 'requires updating' = 'not ready';
  protected new: boolean = true;
  private results: TestCaseResult[] | null | undefined = [];
  protected data: TestCaseData = {
    status: this.status,
    automationFlag: this.automationFlag,
    changesAuthor: this.user,
    createdTime: null,
    executionTime: null,
    expectedExecutionTime: this.executionTime,
    name: this.name,
    preConditions: this.preConditions,
    steps: this.steps,
    postConditions: this.postConditions,
    priority: null,
    testCaseType: null,
    version: 1
  }
  protected testCase: TestCase = {
    name: this.name,
    lastDataIndex: 0,
    folderId: this.folderId,
    folderName: this.folderName,
    type: this.typeOf,
    data: [],
    loading: null,
    new: true,
    results: this.results,
    selected: null
  }
  private initTestCase: any = null;
  private projectId: number | null = null;
  protected deletePreconditionsDisabled: boolean = false;
  protected deletePostConditionsDisabled: boolean = false;
  protected deleteStepsDisabled: boolean = false;
  private testCaseData: TestCaseData[] = [];


  constructor(
    private renderer: Renderer2,
    private dialogRef: MatDialogRef<CreateTestCaseComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private projectService: ProjectService,
    private routerParamsService: RouterParamsService,
    private testCaseService: TestCaseService,
    private dialog: MatDialog,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.routerParamsService.projectId$.subscribe(projectId => {
      this.projectId = projectId;
    });

    this.new = this.dataDialog.isNew;
    this.folderId = this.dataDialog.folderId;
    this.folderName = this.dataDialog.folderName;
    console.log('this.new:', this.new);

    if (this.new) {
      this.progressBar = false;
    }
    if (!this.new) {
      this.testCaseService.getTestCase(+this.dataDialog.testCaseId).subscribe({
          next: (testCase) => {
            this.setVersionFromData(testCase);
            this.selectedVersion = this.versions[this.versions.length -1].value;
            console.log('testCase in setFields::: ', testCase)
            this.setFieldsAndSteps(testCase);
          }, error: (err) => {
            console.error('Ошибка при получении данных текс-кейса при инициализации компонента CreateTestCaseComponent :', err)
          }, complete: (() => {
            this.initEditors();

          })
        }
      )
    }
  }

  setVersionFromData(testCase: TestCase) {
    for (const dataItem of testCase.data) {
      this.versions.push({value: `${dataItem.version}`, viewValue: `VERSION-${dataItem.version}`});
    }
  }

  setFieldsAndSteps(testCase: TestCase) {
    if (testCase) {
      this.initTestCase = testCase;
      this.testCaseData = testCase.data;
      const index = testCase.data.length - 1;
      this.preConditions = testCase.data[index].preConditions!;
      this.steps = testCase.data[index].steps!;
      this.postConditions = testCase.data[index].postConditions!;
      if (testCase) {
        console.log('initTestCase: : ', this.initTestCase);
        this.setFields(this.initTestCase);
        this.progressBar = false;
      }
    }
  }

  choseTestCaseVersion(version: number) {
    const index = Number(version);
    console.log('Index::', index);
    if (index) {
      this.preConditions = this.testCaseData[index - 1].preConditions!;
      this.steps = this.testCaseData[index - 1].steps!;
      this.postConditions = this.testCaseData[index - 1].postConditions!;
      if (this.initTestCase) {
        this.data = this.testCaseData[index - 1];
        this.progressBar = false;
        this.initEditors();
      }
      console.log(this.steps);
      console.log(this.postConditions);
      console.log(this.typesOfPriority)
    }
  }

  setFields(testCase: TestCase) {
    console.log("TESTCASE:::", testCase);
    this.testCaseId = testCase.id;
    const index = testCase.data.length - 1;
    this.name = testCase.name;
    this.type = testCase.type;
    this.folderName = testCase.folderName;
    this.folderId = testCase.folderId;
    this.new = false;
    this.results = testCase.results;
    this.data = testCase.data[index];
    console.log('TESTCASEDATA::', this.data)
    if (testCase.data[index].steps) {

      this.steps = testCase.data[index].steps!;
    }
    if (testCase.data[index].preConditions) {
      this.preConditions = testCase.data[index].preConditions!;
    }
    if (testCase.data[index].postConditions) {
      this.postConditions = testCase.data[index].postConditions!;
    }
  }

  ngAfterViewInit() {


  }

  initEditors() {
    setTimeout(() => {
      this.preConditions.forEach((preCondition, index) => {
        const actionEditor = this.getEditorPreConditionByIndex(index, 'action');
        const expectedResultEditor = this.getEditorPreConditionByIndex(index, 'expectedResult');
        if (actionEditor) {
          this.setHtmlContent(actionEditor, preCondition.action || '');
        }
        if (expectedResultEditor) {
          this.setHtmlContent(expectedResultEditor, preCondition.expectedResult || '');
        }
      });
      this.addPasteEventListenerToPreConditionEditors(this.preConditions);

      this.steps.forEach((step, index) => {
        const actionEditor = this.getStepEditorByIndex(index, 'action');
        const expectedResultEditor = this.getStepEditorByIndex(index, 'expectedResult');
        if (actionEditor) {
          this.setHtmlContent(actionEditor, step.action || '');
        }
        if (expectedResultEditor) {
          this.setHtmlContent(expectedResultEditor, step.expectedResult || '');
        }
      });
      this.addPasteEventListenerToStepEditors(this.steps);
      this.postConditions.forEach((postCondition, index) => {
        const actionEditor = this.getPostConditionEditorByIndex(index, 'action');
        const expectedResultEditor = this.getPostConditionEditorByIndex(index, 'expectedResult');
        if (actionEditor) {
          this.setHtmlContent(actionEditor, postCondition.action || '');
        }
        if (expectedResultEditor) {
          this.setHtmlContent(expectedResultEditor, postCondition.expectedResult || '');
        }
      });
      this.addPasteEventListenerToPostConditionEditors(this.postConditions);

      const editorContainerPreConditionElement = this.editorPreConditionContainer?.nativeElement;
      if (editorContainerPreConditionElement) {
        this.renderer.listen(editorContainerPreConditionElement, 'input', () => this.updateButtonStyles());
        this.renderer.listen(editorContainerPreConditionElement, 'click', () => this.updateButtonStyles());
        this.renderer.listen(editorContainerPreConditionElement, 'keyup', () => this.updateButtonStyles());

      }

      const editorContainerStepElement = this.editorPreConditionContainer?.nativeElement;
      if (editorContainerStepElement) {
        this.renderer.listen(editorContainerStepElement, 'input', () => this.updateButtonStyles());
        this.renderer.listen(editorContainerStepElement, 'click', () => this.updateButtonStyles());
        this.renderer.listen(editorContainerStepElement, 'keyup', () => this.updateButtonStyles());

      }

      const editorContainerPostConditionElement = this.editorPreConditionContainer?.nativeElement;
      if (editorContainerPostConditionElement) {
        this.renderer.listen(editorContainerPostConditionElement, 'input', () => this.updateButtonStyles());
        this.renderer.listen(editorContainerPostConditionElement, 'click', () => this.updateButtonStyles());
        this.renderer.listen(editorContainerPostConditionElement, 'keyup', () => this.updateButtonStyles());

      }
    });

    // Инициализация ResizeObserver для отслеживания изменений размеров элемента
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.elementWidth = entry.contentRect.width;
        console.log('Новая ширина элемента:', this.elementWidth);
      }
    });

    if (this.actionEditor?.nativeElement) {
      this.resizeObserver.observe(this.actionEditor.nativeElement);
    }
    // Подписка на изменения размеров элемента
    console.log('dataDialog.testCaseId: ', this.dataDialog.testCaseId);
    console.log('projectId:::', this.dataDialog.projectId);

    // Установка начального значения
    this.updateElementWidth();
  }

  // Обработчик события изменения размера окна
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateElementWidth();
  }

  private updateElementWidth() {
    if (this.actionEditor) {
      this.elementWidth = this.actionEditor.nativeElement.offsetWidth;
    }
    console.log('Ширина элемента:', this.elementWidth);
  }

  ngOnDestroy() {
    // Отписка от наблюдателя при уничтожении компонента
    if (this.actionEditor) {
      if (this.resizeObserver) {
        this.resizeObserver.unobserve(this.actionEditor.nativeElement);
      }
    }
  }

  onChange() {
    this.hasChange = true;
  }

  addPasteEventListenerToPreConditionEditors(editors: any[]) {
    console.log('addPasteEventListener')
    editors.forEach((editor, index) => {
      const actionEditor = this.getEditorPreConditionByIndex(index, 'action');
      const expectedResultEditor = this.getEditorPreConditionByIndex(index, 'expectedResult');
      if (actionEditor) {
        this.renderer.listen(actionEditor, 'paste', (event: ClipboardEvent) => this.handlePaste(event));
      }
      if (expectedResultEditor) {
        this.renderer.listen(expectedResultEditor, 'paste', (event: ClipboardEvent) => this.handlePaste(event));
      }
    });
  }

  addPasteEventListenerToStepEditors(editors: any[]) {
    console.log('addPasteEventListener')
    editors.forEach((editor, index) => {
      const actionEditor = this.getStepEditorByIndex(index, 'action');
      const expectedResultEditor = this.getStepEditorByIndex(index, 'expectedResult');
      if (actionEditor) {
        this.renderer.listen(actionEditor, 'paste', (event: ClipboardEvent) => this.handlePaste(event));
      }
      if (expectedResultEditor) {
        this.renderer.listen(expectedResultEditor, 'paste', (event: ClipboardEvent) => this.handlePaste(event));
      }
    });
  }

  addPasteEventListenerToPostConditionEditors(editors: any[]) {
    console.log('addPasteEventListener')
    editors.forEach((editor, index) => {
      const actionEditor = this.getPostConditionEditorByIndex(index, 'action');
      const expectedResultEditor = this.getPostConditionEditorByIndex(index, 'expectedResult');
      if (actionEditor) {
        this.renderer.listen(actionEditor, 'paste', (event: ClipboardEvent) => this.handlePaste(event));
      }
      if (expectedResultEditor) {
        this.renderer.listen(expectedResultEditor, 'paste', (event: ClipboardEvent) => this.handlePaste(event));
      }
    });
  }

  handlePaste(event: ClipboardEvent) {
    console.log('handle paste was executed!!!');

    // Сохраняем исходное поведение вставки, если текст воспринимается как код
    if (event.clipboardData?.types.includes('text/plain')) {
      event.preventDefault();

      const text = event.clipboardData.getData('text/plain');
      if (text && document.activeElement) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();

          // Вставляем текст как обычный текстовый узел
          const textNode = document.createTextNode(text);
          range.insertNode(textNode);

          // Перемещаем курсор за вставленный текст
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  private reorderPreConditions() {
    this.preConditions.forEach((step, index) => {
      step.index = index + 1;
    });
  }

  private reorderSteps() {
    this.steps.forEach((step, index) => {
      step.index = index + 1;
    });
  }

  private reorderPostConditions() {
    this.postConditions.forEach((step, index) => {
      step.index = index + 1;
    });
  }

  addStep() {
    const step: TestCaseStep = {
      index: this.steps.length + 1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.steps.push(step);
    this.updateAllSelectedSteps();
  }

  addPreCondition() {
    const preCondition: TestCasePreCondition = {
      index: this.preConditions.length + 1,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.preConditions.push(preCondition);
    this.updateAllSelectedPreconditions();
    console.log(this.preConditions);
  }

  addPostCondition() {
    const postCondition: TestCasePostCondition = {
      index: this.postConditions.length + 1,
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
    this.updateAllSelectedSteps();
  }

  updateAllSelectedSteps() {
    const totalSelected = this.steps.filter(step => step.selected).length;
    this.allSelectedSteps = totalSelected === this.steps.length;
    this.indeterminateSteps = totalSelected > 0 && totalSelected < this.steps.length;
    if (totalSelected > 0) {
      this.deleteStepsDisabled = true;
    }
    if (totalSelected === 0) {
      this.deleteStepsDisabled = false;
    }
  }

  autoResize(event: Event, secondEditor: HTMLElement) {


    const target = event.target as HTMLElement;
    // Проверяем, если клик был по изображению
    if (target.tagName.toLowerCase() === 'img') {
      event.stopPropagation(); // Останавливаем распространение события
      return; // Прерываем выполнение функции, если клик по изображению
    }
    // Используем requestAnimationFrame для отложенного пересчета размеров
    requestAnimationFrame(() => {
      // Проверка, есть ли контент в редакторе
      const isTargetEmpty = !target.textContent || target.textContent.trim() === '';
      const isSecondEditorEmpty = !secondEditor.textContent || secondEditor.textContent.trim() === '';

      // Сбрасываем высоту перед обновлением
      target.style.height = 'auto';
      secondEditor.style.height = 'auto';

      // Если оба редактора пусты, устанавливаем минимальную высоту
      const minHeight = '44px';
      if (isTargetEmpty && isSecondEditorEmpty) {
        target.style.height = minHeight;
        secondEditor.style.height = minHeight;
      } else {
        // Если хотя бы один редактор не пуст, обновляем их высоты
        const newHeight = `${target.scrollHeight}px`;
        const secondEditorHeight = `${secondEditor.scrollHeight}px`;

        // Синхронизируем высоты
        if (isTargetEmpty) {
          target.style.height = secondEditorHeight;
        } else if (isSecondEditorEmpty) {
          secondEditor.style.height = newHeight;
        } else {
          const maxHeight = Math.max(target.scrollHeight, secondEditor.scrollHeight);
          target.style.height = `${maxHeight}px`;
          secondEditor.style.height = `${maxHeight}px`;
        }
      }

      // Обновляем высоту родительского контейнера
      const parentContainer = target.closest('.steps-container') as HTMLElement;
      if (parentContainer) {
        parentContainer.style.height = 'auto';  // Сбрасываем высоту для пересчета
        parentContainer.style.height = `${parentContainer.scrollHeight}px`;
      }
    });
  }


  selectAllPreconditions(checked: boolean) {
    this.preConditions.forEach(step => step.selected = checked);
    this.allSelectedPreConditions = checked;
    this.updateAllSelectedPreconditions();
  }

  updateAllSelectedPreconditions() {
    console.log('updateAllSelectedPreconditions')
    const totalSelected = this.preConditions.filter(step => step.selected).length;
    this.allSelectedPreConditions = totalSelected === this.preConditions.length;
    this.indeterminatePreCondition = totalSelected > 0 && totalSelected < this.preConditions.length;
    if (totalSelected > 0) {
      this.deletePreconditionsDisabled = true;
    }
    if (totalSelected === 0) {
      this.deletePreconditionsDisabled = false;
    }
  }

  deleteSelectedPreconditions() {
    this.preConditions = this.preConditions.filter(step => !step.selected);
    this.reorderPreConditions();
    this.updateAllSelectedPreconditions();
    this.allSelectedPreConditions = false;
    this.onChange();
  }

  selectAllPostConditions(checked: boolean) {
    this.postConditions.forEach(step => step.selected = checked);
    this.allSelectedPostConditions = checked;
    this.updateAllSelectedPostConditions();
  }

  updateAllSelectedPostConditions() {
    const totalSelected = this.postConditions.filter(step => step.selected).length;
    this.allSelectedPostConditions = totalSelected === this.postConditions.length;
    this.indeterminatePostCondition = totalSelected > 0 && totalSelected < this.postConditions.length;
    if (totalSelected > 0) {
      this.deletePostConditionsDisabled = true;
    }
    if (totalSelected === 0) {
      this.deletePostConditionsDisabled = false;
    }
  }

  deleteSelectedPostConditions() {
    this.postConditions = this.postConditions.filter(step => !step.selected);
    this.reorderPostConditions();
    this.updateAllSelectedPostConditions();
    this.allSelectedPostConditions = false;
  }


//   Sidenav ===========================================================

  typesOfTests = [
    {value: 'FUNCTIONAL', viewValue: 'functional'},
    {value: 'SYSTEM', viewValue: 'system'},
    {value: 'PERFORMANCE', viewValue: 'performance'},
    {value: 'REGRESSION', viewValue: 'regression'},
    {value: 'UNIT', viewValue: 'unit'},
    {value: 'SECURITY', viewValue: 'security'},
    {value: 'LOCALIZATION', viewValue: 'localization'},
    {value: 'USABILITY', viewValue: 'usability'}];

  typesOfPriority = [
    {value: 'HIGHEST', viewValue: 'highest'},
    {value: 'HIGH', viewValue: 'high'},
    {value: 'MEDIUM', viewValue: 'medium'},
    {value: 'LOW', viewValue: 'low'}
  ];

  automationFlags = [
    {value: 'AUTO', viewValue: 'auto'},
    {value: 'MANUAL', viewValue: 'manual'}
  ]

  statuses = [
    {value: 'READY', viewValue: 'ready'},
    {value: 'NOT_READY', viewValue: 'not ready'},
    {value: 'REQUIRES_UPDATING', viewValue: 'requires updating'}
  ]


  //                             EDITOR
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // Устанавливает активный редактор при его фокусировке
  setActiveEditor(event: FocusEvent) {
    const target = event.target as HTMLElement;

    // Проверяем, если клик был по изображению
    if (target.tagName.toLowerCase() === 'img') {
      event.stopPropagation(); // Останавливаем распространение события
      return; // Прерываем выполнение функции, если клик по изображению
    }
    this.activeEditor = event.target as HTMLElement;
    this.updateButtonStyles(); // Обновляет стили кнопок на панели инструментов
  }

  // Сохраняет текущее выделение текста (диапазон)
  saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
    }
  }

  // Восстанавливает сохраненное выделение текста
  restoreSelection() {
    const selection = window.getSelection();
    if (this.savedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
    }
  }

  // Переключение стиля текста
  toggleStyle(style: string, value?: string) {
    if (!this.activeEditor) return;

    this.saveSelection(); // Сохранить текущее выделение текста

    if (style === 'color' && value) {
      this.toggleColor(value);
    } else if (style === 'bold' || style === 'italic') {
      this.toggleTextStyle(style);
    } else if (style === 'insertUnorderedList') {
      this.insertUnorderedList();
    }

    this.restoreSelection(); // Восстановить выделение
    this.activeEditor.focus(); // Вернуть фокус на активный редактор
    this.updateButtonStyles(); // Обновить стили кнопок
  }

  // Переключение цвета текста
  toggleColor(color: string) {
    if (!this.activeEditor) return;

    this.saveSelection();

    if (this.savedRange && !this.savedRange.collapsed) {
      // Если есть выделение текста, применить цвет ко всему выделенному
      document.execCommand('foreColor', false, color);
    } else {
      // Если выделения нет, применить цвет к новому символу, который будет введен
      this.applyStyleToCaret('foreColor', color);
    }

    this.restoreSelection();
    this.activeEditor.focus();
    this.updateButtonStyles();
  }

  // Переключение стиля текста (жирный, курсив, подчеркивание)
  toggleTextStyle(style: string) {
    if (!this.activeEditor) return;

    this.saveSelection();

    if (this.savedRange && !this.savedRange.collapsed) {
      // Применить стиль ко всему выделенному тексту
      document.execCommand(style);
    } else {
      // Применить стиль к новому символу, который будет введен
      this.applyStyleToCaret(style);
    }

    this.restoreSelection();
    this.activeEditor.focus();
    this.updateButtonStyles();
  }

  // Применение стиля к позиции каретки
  applyStyleToCaret(command: string, value?: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');

    // Установка стилей для созданного span в зависимости от команды
    if (command === 'foreColor') {
      span.style.color = value!;
    } else if (command === 'bold') {
      span.style.fontWeight = this.currentStyles['bold'] ? 'normal' : 'bold';
    } else if (command === 'italic') {
      span.style.fontStyle = this.currentStyles['italic'] ? 'normal' : 'italic';
    }

    span.innerHTML = '\u200B'; // Добавление невидимого пробела
    range.insertNode(span); // Вставка span на место каретки
    range.setStartAfter(span);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Переключение пользовательского класса
  toggleCustomClass(className: string, buttonClass: string) {
    console.log(buttonClass);
    if (!this.activeEditor) return;

    this.saveSelection();
    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      this.toggleClassOnSelection(className); // Если текст выделен
    } else {
      this.toggleClassAtCaret(className); // Если текст не выделен
    }

    // Переключение класса кнопки
    this.currentClasses[className] = !this.currentClasses[className];

    this.restoreSelection();
    this.updateButtonStyles();

    // Обновить класс кнопки
    this.updateButtonClass(buttonClass, this.currentClasses[className]);
  }

  // Переключение класса на выделении текста
  toggleClassOnSelection(className: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const contents = range.extractContents(); // Извлекаем выделенное содержимое
    const span = document.createElement('span');
    span.className = className;

    // Проверка на наличие вложенных элементов с тем же классом
    let hasClass = false;
    Array.from(contents.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && (node as Element).classList.contains(className)) {
        hasClass = true;
      }
    });

    if (hasClass) {
      // Удаление класса с вложенных элементов
      this.unwrapElements(contents, className);
    } else {
      this.wrapWithClass(contents, className); // Обернуть содержимое в span с классом
    }

    range.deleteContents(); // Удалить текущее содержимое диапазона
    range.insertNode(contents); // Вставить новое содержимое

    // Обновление выделения
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStart(contents, 0);
    newRange.setEnd(contents, contents.childNodes.length);
    selection.addRange(newRange);
  }

  // Переключение класса на месте каретки
  toggleClassAtCaret(className: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const parentSpan = range.startContainer.parentElement;

    // Проверка, находится ли каретка внутри элемента с нужным классом
    if (parentSpan && parentSpan.nodeName === 'SPAN' && parentSpan.classList.contains(className)) {
      const isCaretAtEnd = range.startOffset === parentSpan.textContent!.length;

      if (isCaretAtEnd) {
        // Если каретка в конце элемента, создать новый span без класса
        const newSpan = document.createElement('span');
        newSpan.textContent = '\u200B'; // Добавление невидимого пробела
        parentSpan.after(newSpan);

        // Переместить каретку в новый span
        range.setStart(newSpan, 1);
        range.setEnd(newSpan, 1);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Если каретка не в конце, убрать класс
        this.unwrap(parentSpan);
      }
    } else {
      // Создание нового span с указанным классом
      const newSpan = document.createElement('span');
      newSpan.className = className;
      newSpan.textContent = '\u200B'; // Добавление невидимого пробела
      range.insertNode(newSpan);

      // Переместить каретку после невидимого пробела
      range.setStart(newSpan, 1);
      range.setEnd(newSpan, 1);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  // Обертка выделения в элемент с классом

  // Удаление обертки элемента (убрать класс)
  unwrap(element: HTMLElement) {
    const parent = element.parentNode;
    if (!parent) return;

    // Перенос всех дочерних элементов на уровень родителя и удаление обертки
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }

  // Удаление обертки элементов с указанным классом внутри фрагмента
  unwrapElements(fragment: DocumentFragment, className: string) {
    Array.from(fragment.querySelectorAll(`.${className}`)).forEach(span => {
      this.unwrap(span as HTMLElement);
    });
  }

  // Обновление стилей кнопок в соответствии с текущими стилями выделенного текста
  updateButtonStyles() {
    if (!this.activeEditor) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Обновление состояния стилей (жирный, курсив, подчеркивание)
    this.currentStyles['bold'] = document.queryCommandState('bold');
    this.currentStyles['italic'] = document.queryCommandState('italic');

    // Обновление состояния цвета текста
    const foreColor = document.queryCommandValue('foreColor').toLowerCase();
    this.currentStyles['color-red'] = foreColor === 'rgb(255, 0, 0)' || foreColor === '#ff0000' || foreColor === 'red';
    this.currentStyles['color-green'] = foreColor === 'rgb(0, 128, 0)' || foreColor === '#008000' || foreColor === 'green';
    this.currentStyles['color-black'] = foreColor === 'rgb(0, 0, 0)' || foreColor === '#000000' || foreColor === 'black';

    // Обновление состояния классов
    this.updateClassState('highlight');
    this.updateClassState('underline');
  }

  // Обновление состояния класса
  updateClassState(className: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    if (container.nodeType === Node.ELEMENT_NODE) {
      this.currentClasses[className] = (container as Element).classList.contains(className);
    } else if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
      this.currentClasses[className] = container.parentElement.classList.contains(className);
    } else {
      this.currentClasses[className] = false;
    }
  }

  // Вставка изображения по URL
  insertImage() {
    const url = prompt('Enter image URL', '');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  }

  // Обертка содержимого в элементы с указанным классом
  wrapWithClass(fragment: DocumentFragment, className: string) {
    Array.from(fragment.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent!.trim() !== '') {
        const span = document.createElement('span');
        span.className = className;
        span.textContent = node.textContent;
        node.parentNode!.replaceChild(span, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        (node as HTMLElement).classList.add(className);
      }
    });
  }

  // Обновление класса кнопки
  updateButtonClass(buttonClass: string, isActive: boolean) {
    const button = document.querySelector(`.${buttonClass}`);
    if (button) {
      if (isActive) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }
  }


  setHtmlContent(editor: HTMLElement, content: string): void {
    if (editor) {
      editor.innerHTML = content;
    }
  }

  updateEditorPreConditionContent(editor: HTMLElement, index: number, field: 'action' | 'expectedResult'): void {
    if (editor) {
      this.preConditions[index][field] = editor.innerHTML;
    }
  }

  updateEditorStepContent(editor: HTMLElement, index: number, field: 'action' | 'expectedResult'): void {
    if (editor) {
      this.steps[index][field] = editor.innerHTML;
    }
  }

  updateEditorPostConditionContent(editor: HTMLElement, index: number, field: 'action' | 'expectedResult'): void {


    if (editor) {
      this.postConditions[index][field] = editor.innerHTML;
    }
  }

  getEditorPreConditionByIndex(index: number, field: 'action' | 'expectedResult'): HTMLElement | null {
    if (!this.editorPreConditionContainer) return null;
    const editors = this.editorPreConditionContainer.nativeElement.querySelectorAll('.editor');
    const editorIndex = field === 'action' ? index * 2 : index * 2 + 1;
    return editors[editorIndex] as HTMLElement || null;
  }

  getStepEditorByIndex(index: number, field: 'action' | 'expectedResult'): HTMLElement | null {
    if (!this.editorStepContainer) return null;
    const editors = this.editorStepContainer.nativeElement.querySelectorAll('.editor');
    const editorIndex = field === 'action' ? index * 2 : index * 2 + 1;
    return editors[editorIndex] as HTMLElement || null;
  }

  getPostConditionEditorByIndex(index: number, field: 'action' | 'expectedResult'): HTMLElement | null {

    if (!this.editorPostConditionContainer) return null;
    const editors = this.editorPostConditionContainer.nativeElement.querySelectorAll('.editor');
    const editorIndex = field === 'action' ? index * 2 : index * 2 + 1;
    return editors[editorIndex] as HTMLElement || null;
  }

  insertUnorderedList() {
    if (!this.activeEditor) return;

    this.saveSelection();

    if (this.savedRange) {
      const selection = window.getSelection();
      const node = selection?.anchorNode;
      const parentNode = node?.parentElement;

      // Проверка, если родительский элемент является списком
      if (parentNode && parentNode.tagName === 'LI') {
        // Если курсор находится внутри списка, перемещаем его за список
        this.insertSpanAfterList(parentNode.closest('ul, ol')!);
      } else {
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        li.innerHTML = '\u200B'; // Adding a zero-width space to focus on the new li
        ul.appendChild(li);

        this.savedRange.deleteContents();
        this.savedRange.insertNode(ul);

        this.savedRange.setStart(li, 0);
        this.savedRange.setEnd(li, 0);
        this.savedRange.collapse(true);

        selection!.removeAllRanges();
        selection!.addRange(this.savedRange);

        this.activeEditor.focus();
      }
    }
  }

  insertSpanAfterList(listElement: Element) {
    if (!this.activeEditor) return;

    const span = document.createElement('span');
    span.innerHTML = '\u200B'; // Adding a zero-width space to focus on the new span

    listElement.parentNode!.insertBefore(span, listElement.nextSibling);

    const range = document.createRange();
    const selection = window.getSelection();

    range.setStart(span, 0);
    range.setEnd(span, 0);
    range.collapse(true);

    selection!.removeAllRanges();
    selection!.addRange(range);

    // Ensure the editor is focused after the range is updated
    this.activeEditor.focus();
  }

  triggerFileInput() {
    this.fileInput?.nativeElement.click(); // Триггер для открытия диалогового окна выбора файла
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {

      const file = input?.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        // Создаем контейнер для изображения
        const wrapper = document.createElement('div');
        wrapper.style.maxHeight = '200px';
        wrapper.style.maxWidth = '200px';
        wrapper.className = 'resizable';
        wrapper.contentEditable = 'false'; // Запрещаем редактирование

        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.alt = 'Uploaded image';

        // Задаем стили для изображения
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.objectFit = 'contain';

        // Добавляем обработчик события click для блокировки клика по изображению
        img.addEventListener('click', (event) => {
          this.onImageClick(img.src);
          event.preventDefault(); // Блокирует действие по умолчанию
          event.stopPropagation(); // Останавливает распространение события

        });

        // Вставляем изображение в контейнер
        wrapper.appendChild(img);

        // Сохраняем текущий диапазон (если требуется)
        this.saveSelection();

        // Вставляем контейнер изображения в редактор
        this.savedRange!.insertNode(wrapper);

        // Создаем новый пустой div для каретки и текста
        const emptyDiv = document.createElement('div');
        emptyDiv.style.minHeight = '1em';  // Минимальная высота для видимого места
        emptyDiv.className = 'empty-text-container'; // Класс для стилизации

        // Вставляем span внутрь div, где будет находиться каретка
        const caretSpan = document.createElement('span');
        caretSpan.innerHTML = '&#8203;'; // Невидимый символ Zero Width Space
        emptyDiv.appendChild(caretSpan);

        // Вставляем пустой div после изображения
        wrapper.after(emptyDiv);

        // Устанавливаем каретку в созданный span
        const range = document.createRange();
        range.setStart(caretSpan, 0);
        range.setEnd(caretSpan, 0);

        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges(); // Очищаем предыдущие выделения
          selection.addRange(range); // Добавляем новый диапазон
        }

        // Фокусируем редактор и восстанавливаем стили кнопок
        this.activeEditor!.focus();
        this.updateButtonStyles();
      };

      reader.readAsDataURL(file);
    }

    input.value = ''; // Сбрасываем значение инпута после обработки
  }


  onImageClick(imageSrc: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: {imageSrc},
      panelClass: 'full-screen-dialog'
    });
  }

  addResizeFunctionality(wrapper: HTMLElement, img: HTMLImageElement, maxWidth: number) {
    const aspectRatio = img.naturalWidth / img.naturalHeight; // Соотношение сторон изображения

    // wrapper.style.resize = 'both'; // Разрешаем изменение размера как по ширине, так и по высоте
    // wrapper.style.overflow = 'hidden'; // Скрываем переполнение

    const mouseMoveHandler = (event: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      let newWidth = rect.width + (event.clientX - rect.right);
      let newHeight = rect.height + (event.clientY - rect.bottom);

      // Сохраняем пропорции изображения
      if (newWidth / aspectRatio >= newHeight) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }

      // Ограничиваем максимальную ширину div шириной инпута
      newWidth = Math.min(newWidth, maxWidth);

      // Устанавливаем новый размер wrapper
      wrapper.style.width = `${newWidth}px`;
      wrapper.style.height = `${newHeight}px`;

      // Растягиваем изображение внутри wrapper с сохранением пропорций
      img.style.width = '100%';
      img.style.height = '100%';
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    wrapper.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.target === wrapper) {
        event.preventDefault();

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      }
    });
  }


  ////////////              DIALOG               >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.


  closeMatDialog() {
    this.dialogRef.close();
  }

  save() {
    console.log('test-case in save: ', this.testCase);
    console.log('test-case data in save: ', this.data);
    if (this.new) {
      this.data.name = this.name;
      this.data.changesAuthor = this.user;
      this.testCase.folderId = this.folderId;
      this.testCase.folderName = this.folderName;
      this.testCase.data.push(this.data);
      this.testCase.automationFlag = this.data.automationFlag;
      this.testCase.id = null;

      this.testCase.name = this.name;
      this.testCase.lastDataIndex = this.testCase.data.length - 1;
      console.log('TEstCASE in SAVE::', this.testCase);
      this.testCaseService.addTestCaseToFolder(this.dataDialog.folderId, this.testCase).subscribe(testCase => {
        if (testCase) {
          this.dialogRef.close(testCase);
        }
      }, (error) => {
        console.error(error)
      }, () => {

      })
      // this.dialogRef.close(this.testCase);
    }

    if (!this.new && this.hasChange) {
      this.data.name = this.name;
      this.data.changesAuthor = this.user;
      this.testCase.name = this.name;
      this.testCase.lastDataIndex = this.testCase.data.length - 1;
      if (this.data?.steps) {
        this.data.steps[0].id = undefined;
      }
      if (this.data?.preConditions) {
        this.data.preConditions[0].id = undefined;
      }
      if (this.data?.postConditions) {
        this.data.postConditions[0].id = undefined;
      }
      if (this.data?.id) {
        this.data.id = undefined;
      }
      console.log('TEstCASE in SAVE::', this.testCase);
      console.log("update testCase, data::", this.data)
      console.log("this.testCaseId::", this.testCaseId)
      this.testCaseService.updateTestCase(this.testCaseId, this.data).subscribe(testCase => {
        if (testCase) {
          this.dialogRef.close()
        }
      }, (error) => {
        console.error(error)
      }, () => {

      })
    }
  }


  protected readonly prompt = prompt;



  showChange() {
    console.log(this.hasChange);
    console.log(this.versions);
    console.log(this.version);
  }

  showPreConditions() {
    console.log(this.preConditions)
    console.log(this.steps)
    console.log(this.postConditions)
    console.log('new::', this.new)
  }


}
