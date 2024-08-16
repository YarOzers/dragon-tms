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
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
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
  testCaseResult,
  TestCaseStep
} from "../../../models/test-case";
import {ProjectService} from "../../../services/project.service";
import {MatProgressBar} from "@angular/material/progress-bar";
import {RouterParamsService} from "../../../services/router-params.service";

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
    MatProgressBar
  ],
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
  elementWidth!: number;
  private resizeObserver!: ResizeObserver;


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
  protected preConditions: TestCasePreCondition[] = [this.preCondition];
  protected postConditions: TestCasePostCondition[] = [this.postCondition];
  protected testCaseId = 0;
  private folderName = '';
  private folderId: number | null = null;
  protected typeOfTest: string | null = null;
  protected type: 'functional' | 'system' | 'performance' | 'regression' | 'unit' | 'security' | 'localization' | 'usability' | null = null;
  protected automationFlag: 'auto' | 'manual' | null = null;
  protected executionTime: string | null = '00:00';
  protected status: 'ready' | 'not ready' | 'requires updating' = 'not ready';
  protected priority: 'Highest' | "High" | "Medium" | "Low" | null = "Low";
  protected new: boolean = true;
  private results: testCaseResult[] | null | undefined = [];
  counter = this.preConditions.length + 1;
  protected data: TestCaseData = {
    status: this.status,
    automationFlag: this.automationFlag,
    changesAuthor: this.user,
    createdTime: null,
    executionTime: null,
    expectedExecutionTime: this.executionTime,
    name: this.name,
    preConditionItems: this.preConditions,
    stepItems: this.steps,
    postConditionItems: this.postConditions,
    priority: null,
    type: this.type,
    version: 1
  }
  protected testCase: TestCase = {
    id: this.testCaseId,
    name: this.name,
    lastDataIndex: 0,
    folderId: this.folderId,
    folderName: this.folderName,
    type: this.typeOf,
    author: this.user,
    data: [],
    loading: null,
    new: true,
    results: this.results,
    selected: null
  }
  private initTestCase: any = null;
  private projectId: number | null = null;


  constructor(
    private renderer: Renderer2,
    private dialogRef: MatDialogRef<CreateTestCaseComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private projectService: ProjectService,
    private routerParamsService: RouterParamsService
  ) {
  }

  ngOnInit() {
    this.routerParamsService.projectId$.subscribe(projectId => {
      this.projectId = projectId;
      this.projectService.getAllProjectTestCases(Number(this.projectId)).subscribe(testCases => {
        this.testCase.id = testCases.length + 1;
      })
    });

    this.new = this.dataDialog.isNew;
    this.folderId = this.dataDialog.folderId;
    this.folderName = this.dataDialog.folderName;
    console.log('this.new:', this.new);
  }

  setFields(testCase: TestCase) {

    const index = testCase.data.length - 1;
    console.log('index: ', index);
    console.log('STEP_ITEMS: ', testCase.data[index].stepItems)
    this.testCaseId = testCase.id;
    this.name = testCase.name;
    this.typeOf = testCase.type;
    this.folderName = testCase.folderName;
    this.folderId = testCase.folderId;
    this.user = testCase.author;
    this.new = false;
    this.results = testCase.results;
    this.data = testCase.data[index];
    console.log('stepItems: ', testCase.data[index].stepItems)
    if (testCase.data[index].stepItems) {

      this.steps = testCase.data[index].stepItems;
    }
    if (testCase.data[index].preConditionItems) {
      this.preConditions = testCase.data[index].preConditionItems;
    }
    if (testCase.data[index].postConditionItems) {
      this.postConditions = testCase.data[index].postConditionItems;
    }
    console.log('preConditions:::::::::', testCase.data[index].preConditionItems);
  }

  ngAfterViewInit() {
    if (!this.new) {
      this.projectService.getTestCaseById(+this.dataDialog.projectId, +this.dataDialog.testCaseId).subscribe({
          next: (testCase) => {
            console.log('testCase in setFields::: ', testCase)
            if (testCase) {
              this.initTestCase = testCase;
              if (testCase) {
                console.log('initTestCase: : ', this.initTestCase);
                this.setFields(this.initTestCase);
                this.initEditors();
              }
            }
          }, error: (err) => {
            console.error('Ошибка при получении данных текс-кейса при инициализации компонента CreateTestCaseComponent :', err)
          }
        }
      )
    }

    if (this.new) {

      this.projectService.getAllProjectTestCases(this.dataDialog.projectId).subscribe({
        next: (testCases) => {

        }
      })
      this.initEditors();
    }


  }

  initEditors() {
    setTimeout(() => {
      console.log('preConditions in setTimeout: ', this.preConditions);
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
      this.resizeObserver.unobserve(this.actionEditor.nativeElement);
    }
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
      id: this.preConditions.length + 1,
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

  autoResize(event: Event, secondEditor: HTMLElement) {
    const target = event.target as HTMLElement;

    // Используем requestAnimationFrame для отложенного пересчета размеров
    requestAnimationFrame(() => {
      // Сбрасываем высоту перед обновлением
      target.style.height = 'auto';

      // Обновляем высоту измененного элемента
      target.style.height = `${target.scrollHeight}px`;

      // Выравниваем высоту двух соседних элементов
      this.equalizeTwoEditorsHeight(target, secondEditor);

      // Принудительное обновление размеров родительского контейнера
      const parentContainer = target.closest('.steps-container') as HTMLElement;
      if (parentContainer) {
        parentContainer.style.height = 'auto';
        parentContainer.style.height = `${Math.max(parentContainer.scrollHeight, target.scrollHeight)}px`;
      }
    });
  }

  selectAllPreconditions(checked: boolean) {
    this.preConditions.forEach(step => step.selected = checked);
    this.allSelectedPreConditions = checked;
  }

  updateAllSelectedPreconditions() {
    const totalSelected = this.preConditions.filter(step => step.selected).length;
    this.allSelectedPreConditions = totalSelected === this.preConditions.length;
    this.indeterminatePreCondition = totalSelected > 0 && totalSelected < this.preConditions.length;
  }

  deleteSelectedPreconditions() {
    this.preConditions = this.preConditions.filter(step => !step.selected);
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
    'ready',
    'not ready',
    'requires updating'
  ]


  //                             EDITOR
  //////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////

  equalizeTwoEditorsHeight(editor1: HTMLElement, editor2: HTMLElement) {
    requestAnimationFrame(() => {
      editor1.style.height = 'auto';
      editor2.style.height = 'auto';

      const maxHeight = Math.max(editor1.scrollHeight, editor2.scrollHeight);

      editor1.style.height = `${maxHeight}px`;
      editor2.style.height = `${maxHeight}px`;
    });
  }

  show() {
    console.log(this.preConditions);
    this.add();
  }


  add() {
    const precondition: TestCasePreCondition = {
      id: this.counter,
      selected: false,
      action: '',
      expectedResult: ''
    }
    this.preConditions.push(precondition);
  }

  // Устанавливает активный редактор при его фокусировке
  setActiveEditor(event: FocusEvent) {
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
  wrapSelectionWithClass(className: string) {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = className;

    // Извлечение содержимого и обертка его в span
    span.appendChild(range.extractContents());
    range.insertNode(span);

    // Обновление выделения
    selection.removeAllRanges();
    range.selectNodeContents(span);
    selection.addRange(range);
  }

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

  getHtmlContent(editor: HTMLElement): string {
    return editor.innerHTML;
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

  handleDrop(event: DragEvent) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer && dataTransfer.files && dataTransfer.files[0]) {
      const file = dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        this.insertImageIntoEditor(img);
      };
      reader.readAsDataURL(file);
    }
  }

  insertImageIntoEditor(image: HTMLImageElement) {
    const selection = window.getSelection();
    if (selection) {
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(image);
      selection.collapseToEnd();
    }

  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  triggerFileInput() {
    this.fileInput?.nativeElement.click(); // Триггер для открытия диалогового окна выбора файла
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {

      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const wrapper = document.createElement('div');
        wrapper.style.minHeight = '200px';
        wrapper.style.minWidth = '200px';
        wrapper.className = 'resizable';
        wrapper.contentEditable = 'false'; // Запрещаем редактирование

        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.alt = 'Uploaded image';

        // Получаем ширину инпута (родительского элемента)
        const inputWidth = this.activeEditor!.clientWidth;
        console.log(inputWidth);

        // Определяем размеры изображения
        const imgRatio = img.naturalWidth / img.naturalHeight;
        let imgWidth = img.naturalWidth;
        let imgHeight = img.naturalHeight;

        // Если изображение шире инпута, уменьшаем его до ширины инпута
        if (imgWidth > inputWidth) {
          imgWidth = inputWidth;
          imgHeight = imgWidth / imgRatio;
        }

        wrapper.style.width = `${imgWidth}px`;
        wrapper.style.height = `${imgHeight}px`;

        // Устанавливаем размеры изображения в div с сохранением пропорций
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain'; // Сохраняем пропорции изображения

        wrapper.appendChild(img);

        // Создаем новый span под div для установки каретки
        const caretPositionSpan = document.createElement('span');
        caretPositionSpan.innerHTML = '<br>'; // создаем разрыв строки для видимости

        this.saveSelection();
        this.savedRange!.insertNode(wrapper);
        this.savedRange!.insertNode(caretPositionSpan);
        this.savedRange!.setStartAfter(caretPositionSpan);
        this.savedRange!.collapse(true);

        // Перемещаем каретку в span
        const range = document.createRange();
        range.setStart(caretPositionSpan, 0);
        range.setEnd(caretPositionSpan, 0);

        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }

        this.restoreSelection();
        this.activeEditor!.focus();
        this.updateButtonStyles();

        // Добавляем возможность изменения размера div
        this.addResizeFunctionality(wrapper, img, inputWidth);
      };

      reader.readAsDataURL(file);
    }

    input.value = '';
  }

  addResizeFunctionality(wrapper: HTMLElement, img: HTMLImageElement, maxWidth: number) {
    const aspectRatio = img.naturalWidth / img.naturalHeight; // Соотношение сторон изображения

    wrapper.style.resize = 'both'; // Разрешаем изменение размера как по ширине, так и по высоте
    wrapper.style.overflow = 'hidden'; // Скрываем переполнение

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
      this.testCase.id = this.testCaseId;
      this.testCase.folderId = this.folderId;
      this.testCase.folderName = this.folderName;
      this.testCase.data.push(this.data);
      this.testCase.automationFlag = this.data.automationFlag;
    }
    this.testCase.name = this.name;
    this.testCase.lastDataIndex = this.testCase.data.length - 1;
    console.log('lastDAtaIndex in save: ', this.testCase.lastDataIndex);
    this.dialogRef.close(this.testCase);

  }


  protected readonly prompt = prompt;


  showName() {
    console.log(this.name);
  }

  getData() {
    console.log('preConditions---------------->', this.preConditions);
  }
}
