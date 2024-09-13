import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import {
  InlineEditor,
  AccessibilityHelp,
  AutoLink,
  Autosave,
  Bold,
  Essentials,
  Italic,
  Link,
  Paragraph,
  SelectAll,
  Undo,
  type EditorConfig
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
export class CkEditorComponent implements AfterViewInit{

  @Output() editorEvent = new EventEmitter<string>();

  sendEditorData(){
    this.editorEvent.emit(this.editorData);
  }
  constructor(private changeDetector: ChangeDetectorRef) {}

  public isLayoutReady = false;
  public Editor = InlineEditor;
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
      placeholder: 'Type or paste your content here!'
    };

    this.isLayoutReady = true;
    this.changeDetector.detectChanges();
  }

  showEdotor() {
    console.log(this.Editor);
    console.log(this.editorData);
  }
}
