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
      this.currentStyles[`${style}-${value}`] = !this.currentStyles[`${style}-${value}`];
      return;
    }

    if (this.currentStyles[style]) {
      document.execCommand(style, false); // Команда execCommand сама переключает стиль
      this.currentStyles[style] = !this.currentStyles[style];
    } else {
      document.execCommand(style, false);
      this.currentStyles[style] = true;
    }

    this.updateButtonStyles();
  }

  toggleColor(color: string) {
    document.execCommand('foreColor', false, color);
    Object.keys(this.currentStyles).forEach(key => {
      if (key.startsWith('color-')) {
        this.currentStyles[key] = false;
      }
    });
    this.currentStyles[`color-${color}`] = true;
  }

  updateButtonStyles() {
    if (!this.activeEditor) {
      return;
    }

    this.currentStyles['bold'] = document.queryCommandState('bold');
    this.currentStyles['italic'] = document.queryCommandState('italic');
    this.currentStyles['underline'] = document.queryCommandState('underline');
    this.currentStyles['color-red'] = document.queryCommandValue('foreColor') === 'rgb(255, 0, 0)';
    this.currentStyles['color-green'] = document.queryCommandValue('foreColor') === 'rgb(0, 128, 0)';
    this.currentStyles['color-black'] = document.queryCommandValue('foreColor') === 'rgb(0, 0, 0)';
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
