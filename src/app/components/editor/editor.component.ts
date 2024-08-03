import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
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
export class EditorComponent {
  editors: number[] = [1, 2, 3]; // три текстовых редактора для примера
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
    if (!this.activeEditor) {
      return;
    }

    this.saveSelection();

    if (style === 'color' && value) {
      this.toggleColor(value);
    } else if (style === 'bold' || style === 'italic' || style === 'underline') {
      this.toggleTextStyle(style);
    } else {
      document.execCommand(style, false);
    }

    this.restoreSelection();
    this.activeEditor.focus();
    this.updateButtonStyles();
  }

  toggleColor(color: string) {
    if (!this.activeEditor) {
      return;
    }

    this.saveSelection();

    if (this.savedRange && !this.savedRange.collapsed) {
      // Если есть выделение
      document.execCommand('foreColor', false, color);
    } else {
      // Если нет выделения, меняем цвет для текущей позиции каретки
      this.applyStyleToCaret('foreColor', color);
    }

    this.restoreSelection();
    this.activeEditor.focus();
    this.updateButtonStyles();
  }

  toggleTextStyle(style: string) {
    if (!this.activeEditor) {
      return;
    }

    this.saveSelection();

    if (this.savedRange && !this.savedRange.collapsed) {
      // Если есть выделение
      document.execCommand(style, false);
    } else {
      // Если нет выделения, меняем стиль для текущей позиции каретки
      this.applyStyleToCaret(style);
    }

    this.restoreSelection();
    this.activeEditor.focus();
    this.updateButtonStyles();
  }

  applyStyleToCaret(command: string, value?: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');

    if (command === 'foreColor') {
      span.style.color = value!;
    } else if (command === 'bold') {
      span.style.fontWeight = 'bold';
    } else if (command === 'italic') {
      span.style.fontStyle = 'italic';
    } else if (command === 'underline') {
      span.style.textDecoration = 'underline';
    }

    // Если в месте каретки уже есть текст, продолжаем его вводить с новым стилем
    span.innerHTML = '&#8203;'; // Невидимый символ
    range.insertNode(span);

    // Перемещаем каретку внутрь span
    range.setStart(span, 1);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  updateButtonStyles() {
    if (!this.activeEditor) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer as HTMLElement : range.commonAncestorContainer.parentElement;

    if (parentElement) {
      this.currentStyles['bold'] = document.queryCommandState('bold');
      this.currentStyles['italic'] = document.queryCommandState('italic');
      this.currentStyles['underline'] = document.queryCommandState('underline');

      const foreColor = document.queryCommandValue('foreColor').toLowerCase();
      this.currentStyles['color-red'] = foreColor === 'rgb(255, 0, 0)' || foreColor === '#ff0000' || foreColor === 'red';
      this.currentStyles['color-green'] = foreColor === 'rgb(0, 128, 0)' || foreColor === '#008000' || foreColor === 'green';
      this.currentStyles['color-black'] = foreColor === 'rgb(0, 0, 0)' || foreColor === '#000000' || foreColor === 'black';
    }
  }

  insertImage() {
    const url = prompt('Enter image URL', '');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  }
}
