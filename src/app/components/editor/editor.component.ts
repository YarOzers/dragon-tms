import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { MatMiniFabButton } from "@angular/material/button";
import {TestCasePreCondition} from "../../models/test-case";
import {FormsModule} from "@angular/forms";
import {ContentEditableValueAccessorDirective} from "./content-editable-value-accessor.directive";

@Component({
  selector: 'app-editor', // Указывает на селектор компонента, который используется в HTML
  standalone: true, // Указывает, что компонент не зависит от других модулей
  imports: [
    NgForOf, // Директива, используемая для итерации по массиву и отображения его элементов
    NgIf, // Директива, используемая для условного отображения элементов
    MatMiniFabButton,
    FormsModule,
    ContentEditableValueAccessorDirective,
    // Компонент Angular Material для мини-кнопок FAB
  ],
  templateUrl: './editor.component.html', // Путь к HTML-шаблону компонента
  styleUrls: ['./editor.component.css'] // Путь к файлу CSS-стилей компонента
})
export class EditorComponent implements AfterViewInit {

  @ViewChild('editorContainer', { static: true }) editorContainer: ElementRef<HTMLDivElement> | undefined;

  preConditions: TestCasePreCondition[] = [
    { id: 1, selected: false, action: '', expectedResult: '' },
    { id: 2, selected: false, action: '', expectedResult: '' },
    { id: 3, selected: false, action: '', expectedResult: '' }
  ];

  counter = this.preConditions.length +1;
  private preCondition: TestCasePreCondition = {
    id: 1,
    selected: false,
    action: '',
    expectedResult: ''
  }

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

  constructor(private renderer: Renderer2) {}

  // Метод жизненного цикла Angular, вызывается после инициализации представления
  ngAfterViewInit() {
    setTimeout(() => {
      this.preConditions.forEach((preCondition, index) => {
        const actionEditor = this.getEditorByIndex(index, 'action');
        const expectedResultEditor = this.getEditorByIndex(index, 'expectedResult');
        if (actionEditor) {
          this.setHtmlContent(actionEditor, preCondition.action || '');
        }
        if (expectedResultEditor) {
          this.setHtmlContent(expectedResultEditor, preCondition.expectedResult || '');
        }
      });

      const editorContainerElement = this.editorContainer?.nativeElement;
      if (editorContainerElement) {
        this.renderer.listen(editorContainerElement, 'input', () => this.updateButtonStyles());
        this.renderer.listen(editorContainerElement, 'click', () => this.updateButtonStyles());
        this.renderer.listen(editorContainerElement, 'keyup', () => this.updateButtonStyles());
      }
    });
  }

  show(){
    console.log(this.preConditions);
    this.add();
  }

  add(){
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
    }  else if (style === 'insertUnorderedList') {
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

  updateEditorContent(editor: HTMLElement, index: number, field: 'action' | 'expectedResult'): void {
    if (editor) {
      const content = editor.innerHTML;
      this.preConditions[index][field] = content;
    }
  }

  getEditorByIndex(index: number, field: 'action' | 'expectedResult'): HTMLElement | null {
    if (!this.editorContainer) return null;
    const editors = this.editorContainer.nativeElement.querySelectorAll('.editor');
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

  handleEnterKeyInList(li: HTMLElement) {
    this.renderer.listen(li, 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const newLi = document.createElement('li');
        newLi.innerHTML = '\u200B'; // Adding a zero-width space to focus on the new li
        li.parentElement!.insertBefore(newLi, li.nextSibling);

        const range = document.createRange();
        range.setStart(newLi, 0);
        range.setEnd(newLi, 0);
        range.collapse(true);

        const selection = window.getSelection();
        selection!.removeAllRanges();
        selection!.addRange(range);
      }
    });
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
}
