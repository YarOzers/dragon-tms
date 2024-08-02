import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  editors: number[] = [1, 2, 3]; // три текстовых редактора для примера
  activeStyle: string | null = null;

  fontWait = false;
  fontStyle = false;
  textDecoration = false;

  @ViewChild('editor', { static: true }) editor: ElementRef<HTMLDivElement> | undefined;
  activeEditor: HTMLElement | null = null;

  setActiveEditor(event: FocusEvent) {
    this.activeEditor = event.target as HTMLElement;
  }

  applyStyle(style: string, value?: string) {
    if (style === 'color' && value) {
      this.applyColor(value);
      this.activeStyle = style + '-' + value;
      return;
    }

    if (style === 'bold') {
      document.execCommand('bold', false);
      this.activeStyle = 'bold';
    } else if (style === 'italic') {
      document.execCommand('italic', false);
      this.activeStyle = 'italic';
    } else if (style === 'underline') {
      document.execCommand('underline', false);
      this.activeStyle = 'underline';
    } else if (style === 'normal') {
      document.execCommand('removeFormat', false);
      this.activeStyle = 'normal'
    }
  }

  processNode(node: Node, style: string, value: string | undefined, fragment: DocumentFragment) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      // Оборачиваем текстовый узел в span с нужными стилями
      const span = document.createElement('span');

      // Применяем стиль
      if (style === 'bold') {
        span.style.fontWeight = 'bold';

      } else if (style === 'italic') {
        span.style.fontStyle = 'italic';
      } else if (style === 'underline') {
        span.style.textDecoration = 'underline';
      } else if (style === 'color') {
        span.style.color = value || 'black';
      } else if (style === 'normal') {
        this.fontWait = false;
        // Удаляем стили, возвращая текст к нормальному состоянию
        span.style.fontWeight = 'normal';
        span.style.fontStyle = 'normal';
        span.style.textDecoration = 'none';
        span.style.color = 'inherit';
      }

      span.textContent = node.textContent;
      fragment.appendChild(span);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Если узел является элементом, клонируем его и применяем стиль ко всем дочерним узлам
      const element = node as HTMLElement;
      const newElement = document.createElement(element.tagName);

      // Копируем атрибуты и стили
      Array.from(element.attributes).forEach(attr => newElement.setAttribute(attr.name, attr.value));
      newElement.style.cssText = element.style.cssText;

      // Применяем новый стиль
      if (style === 'bold') {
        newElement.style.fontWeight = 'bold';
      } else if (style === 'italic') {
        newElement.style.fontStyle = 'italic';
      } else if (style === 'underline') {
        newElement.style.textDecoration = 'underline';
      } else if (style === 'color') {
        newElement.style.color = value || 'black';
      } else if (style === 'normal') {
        // Удаляем стили, возвращая текст к нормальному состоянию
        newElement.style.fontWeight = 'normal';
        newElement.style.fontStyle = 'normal';
        newElement.style.textDecoration = 'none';
        newElement.style.color = 'inherit';
      }

      // Создаем временный фрагмент для обработки дочерних узлов
      const tempFragment = document.createDocumentFragment();
      Array.from(element.childNodes).forEach(childNode => {
        this.processNode(childNode, style, value, tempFragment);
      });

      // Добавляем временный фрагмент к новому элементу
      newElement.appendChild(tempFragment);
      fragment.appendChild(newElement);
    }
  }

  applyColor(color: string) {
    document.execCommand('foreColor', false, color);
  }


  insertImage() {
    const url = prompt('Enter image URL', '');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  }

  getNextNode(node: Node): Node | null {
    if (node.firstChild) {
      return node.firstChild;
    }
    while (node) {
      if (node.nextSibling) {
        return node.nextSibling;
      }
      node = node.parentNode!;
    }
    return null;
  }

}
