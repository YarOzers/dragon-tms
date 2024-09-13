import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {NgIf} from '@angular/common';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

import {
  AccessibilityHelp,
  AutoLink,
  Autosave,
  BalloonEditor,
  Bold,
  type EditorConfig,
  Essentials,
  Italic,
  Link,
  Paragraph,
  SelectAll,
  Undo
} from 'ckeditor5';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-ck-editor',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CKEditorModule,
    NgIf,
    FormsModule
  ],
  templateUrl: './ck-editor.component.html',
  styleUrl: './ck-editor.component.scss'
})
export class CkEditorComponent implements AfterViewInit, OnChanges{

  @Output() editorEvent = new EventEmitter<string>();
  @Input() content: string | undefined= '';

  onEditorChange(event: any): void {
    const content = event.editor.getData();  // Получение данных из редактора
    this.editorEvent.emit(content);          // Отправка данных в родительский компонент
  }
  constructor(private changeDetector: ChangeDetectorRef) {}

  public isLayoutReady = false;
  public Editor = BalloonEditor;
  public config: EditorConfig = {}; // CKEditor needs the DOM tree before calculating the configuration.
  editorData: string = '';
  public ngAfterViewInit(): void {
    this.config = {
      toolbar: {
        items: ['undo', 'redo', '|', 'bold', 'italic', '|', 'link'],
        shouldNotGroupWhenFull: false
      },
      plugins: [AccessibilityHelp, AutoLink, Autosave, Bold, Essentials, Italic, Link, Paragraph, SelectAll, Undo],
      initialData: '',
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          toggleDownloadable: {
            mode: 'manual',
            label: 'Downloadable',
            attributes: {
              download: 'file'
            }
          }
        }
      },
      placeholder: ''
    };

    this.isLayoutReady = true;
    this.changeDetector.detectChanges();
  }

  showEdotor() {
    console.log(this.Editor);
    console.log(this.editorData);
  }
  // Отслеживаем изменения входных данных
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      const currentValue = changes['content'].currentValue;

      // Обновляем содержимое редактора только если данные изменились
      if (currentValue !== changes['content'].previousValue) {
        this.updateEditorContent(currentValue);
      }
    }
  }
  // Метод для обновления данных в редакторе
  updateEditorContent(newContent: string) {
    // Здесь вы можете добавить логику обновления редактора
    // Например, если нужно использовать специфический метод CKEditor для установки данных:
    console.log('Обновляем данные в редакторе:', newContent);
    this.content = newContent; // Обновляем ngModel и видимое содержимое
  }

}
