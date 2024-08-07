import {AfterViewInit, Component, ElementRef, Renderer2, signal, ViewChild} from '@angular/core';
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
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
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
    MatInput,
    MatMiniFabButton
  ],
  templateUrl: './create-test-case-example.component.html',
  styleUrls: [
    './create-test-case-example.component.css',
  './editor.component.css'
  ]
})
export class CreateTestCaseExampleComponent implements AfterViewInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;

  //////////////////////////////////////////////////////////////////

  @ViewChild('editor', { static: true }) editor: ElementRef<HTMLDivElement> | undefined;
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

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (this.editor) {
      // Прослушивание событий 'input', 'click', 'keyup' для обновления стилей кнопок
      this.renderer.listen(this.editor.nativeElement, 'input', () => this.updateButtonStyles());
      this.renderer.listen(this.editor.nativeElement, 'click', () => this.updateButtonStyles());
      this.renderer.listen(this.editor.nativeElement, 'keyup', () => this.updateButtonStyles());
    }
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


  //                             EDITOR
  //////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////

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

}


