import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { MatMiniFabButton } from "@angular/material/button";

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatMiniFabButton
  ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit {
  editors: number[] = [1, 2, 3];
  currentStyles: { [key: string]: boolean } = {
    bold: false,
    italic: false,
    underline: false,
    'color-red': false,
    'color-green': false,
    'color-black': false
  };

  @ViewChild('editor', { static: true }) editor: ElementRef<HTMLDivElement> | undefined;
  activeEditor: HTMLElement | null = null;
  private savedRange: Range | null = null;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (this.editor) {
      this.renderer.listen(this.editor.nativeElement, 'input', () => this.updateButtonStyles());
      this.renderer.listen(this.editor.nativeElement, 'click', () => this.updateButtonStyles());
      this.renderer.listen(this.editor.nativeElement, 'keyup', () => this.updateButtonStyles());
    }
  }

  setActiveEditor(event: FocusEvent) {
    this.activeEditor = event.target as HTMLElement;
    this.updateButtonStyles();
  }

  saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
    }
  }

  restoreSelection() {
    const selection = window.getSelection();
    if (this.savedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
    }
  }

  toggleStyle(style: string, value?: string) {
    if (!this.activeEditor) return;

    this.saveSelection();

    if (style === 'color' && value) {
      this.toggleColor(value);
    } else if (style === 'bold' || style === 'italic' || style === 'underline') {
      this.toggleTextStyle(style);
    }

    this.restoreSelection();
    this.activeEditor.focus();
    this.updateButtonStyles();
  }

  toggleColor(color: string) {
    if (!this.activeEditor) return;

    this.saveSelection();

    if (this.savedRange && !this.savedRange.collapsed) {
      document.execCommand('foreColor', false, color);
    } else {
      this.applyStyleToCaret('foreColor', color);
    }

    this.restoreSelection();
    this.activeEditor.focus();
    this.updateButtonStyles();
  }

  toggleTextStyle(style: string) {
    if (!this.activeEditor) return;

    this.saveSelection();

    if (this.savedRange && !this.savedRange.collapsed) {
      document.execCommand(style);
    } else {
      this.applyStyleToCaret(style);
    }

    this.restoreSelection();
    this.activeEditor.focus();
    this.updateButtonStyles();
  }

  applyStyleToCaret(command: string, value?: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');

    if (command === 'foreColor') {
      span.style.color = value!;
    } else if (command === 'bold') {
      span.style.fontWeight = this.currentStyles['bold'] ? 'normal' : 'bold';
    } else if (command === 'italic') {
      span.style.fontStyle = this.currentStyles['italic'] ? 'normal' : 'italic';
    } else if (command === 'underline') {
      span.style.textDecoration = this.currentStyles['underline'] ? 'none' : 'underline';
    }

    span.innerHTML = '\u200B'; // Zero-width space
    range.insertNode(span);
    range.setStartAfter(span);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  toggleCustomClass(className: string) {
    if (!this.activeEditor) return;

    this.saveSelection();
    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      this.toggleClassOnSelection(className);
    } else {
      this.toggleClassAtCaret(className);
    }

    this.restoreSelection();
    this.updateButtonStyles();
  }

  toggleClassOnSelection(className: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const contents = range.extractContents();
    const span = document.createElement('span');
    span.className = className;

    // Проверка на вложенные элементы с тем же классом
    let hasClass = false;
    Array.from(contents.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && (node as Element).classList.contains(className)) {
        hasClass = true;
      }
    });

    if (hasClass) {
      // Удалить класс с вложенных элементов
      this.unwrapElements(contents, className);
    } else {
      this.wrapWithClass(contents, className);
    }

    range.deleteContents();
    range.insertNode(contents);

    // Обновление выделения
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStart(contents, 0);
    newRange.setEnd(contents, contents.childNodes.length);
    selection.addRange(newRange);
  }

  toggleClassAtCaret(className: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const parentSpan = range.startContainer.parentElement;

    if (parentSpan && parentSpan.nodeName === 'SPAN' && parentSpan.classList.contains(className)) {
      const isCaretAtEnd = range.startOffset === parentSpan.textContent!.length;

      if (isCaretAtEnd) {
        // Создать новый span без класса и переместить каретку внутрь него
        const newSpan = document.createElement('span');
        newSpan.textContent = '\u200B'; // Zero-width space
        parentSpan.after(newSpan);

        // Переместить каретку в новый span
        range.setStart(newSpan, 1);
        range.setEnd(newSpan, 1);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Если каретка не в конце, просто убираем класс
        this.unwrap(parentSpan);
      }
    } else {
      // Создание нового span с указанным классом
      const newSpan = document.createElement('span');
      newSpan.className = className;
      newSpan.textContent = '\u200B'; // Zero-width space
      range.insertNode(newSpan);

      // Переместить каретку после zero-width space
      range.setStart(newSpan, 1);
      range.setEnd(newSpan, 1);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  wrapSelectionWithClass(className: string) {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = className;

    // Extract contents and wrap them in a span
    span.appendChild(range.extractContents());
    range.insertNode(span);

    // Adjust selection to the new element
    selection.removeAllRanges();
    range.selectNodeContents(span);
    selection.addRange(range);
  }

  unwrap(element: HTMLElement) {
    const parent = element.parentNode;
    if (!parent) return;

    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }

  unwrapElements(fragment: DocumentFragment, className: string) {
    Array.from(fragment.querySelectorAll(`.${className}`)).forEach(span => {
      this.unwrap(span as HTMLElement);
    });
  }

  updateButtonStyles() {
    if (!this.activeEditor) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    this.currentStyles['bold'] = document.queryCommandState('bold');
    this.currentStyles['italic'] = document.queryCommandState('italic');
    this.currentStyles['underline'] = document.queryCommandState('underline');

    const foreColor = document.queryCommandValue('foreColor').toLowerCase();
    this.currentStyles['color-red'] = foreColor === 'rgb(255, 0, 0)' || foreColor === '#ff0000' || foreColor === 'red';
    this.currentStyles['color-green'] = foreColor === 'rgb(0, 128, 0)' || foreColor === '#008000' || foreColor === 'green';
    this.currentStyles['color-black'] = foreColor === 'rgb(0, 0, 0)' || foreColor === '#000000' || foreColor === 'black';
  }

  insertImage() {
    const url = prompt('Enter image URL', '');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  }

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
}
