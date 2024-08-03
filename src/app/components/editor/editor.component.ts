import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {MatMiniFabButton} from "@angular/material/button";

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatMiniFabButton
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
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

  constructor(private renderer: Renderer2) {}

  setActiveEditor(event: FocusEvent) {
    this.activeEditor = event.target as HTMLElement;
    this.updateButtonStyles();
  }

  toggleStyle(style: string, value?: string) {
    if (!this.activeEditor) {
      return;
    }

    if (style === 'color' && value) {
      this.toggleColor(value);
      return;
    }

    document.execCommand(style, false);
    this.currentStyles[style] = document.queryCommandState(style);

    this.updateButtonStyles();
  }

  toggleColor(color: string) {
    document.execCommand('foreColor', false, color);

    // Обновляем активные стили
    this.currentStyles['color-red'] = color === 'red';
    this.currentStyles['color-green'] = color === 'green';
    this.currentStyles['color-black'] = color === 'black';

    this.updateButtonStyles();
  }

  updateButtonStyles() {
    if (!this.activeEditor) {
      return;
    }

    // Обновляем стили кнопок
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

  ngAfterViewInit() {
    if (this.editor) {
      this.renderer.listen(this.editor.nativeElement, 'input', () => this.updateButtonStyles());
      this.renderer.listen(this.editor.nativeElement, 'click', () => this.updateButtonStyles());
      this.renderer.listen(this.editor.nativeElement, 'keyup', () => this.updateButtonStyles());
    }
  }
}
