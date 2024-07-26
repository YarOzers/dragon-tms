import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DragAndDropExampleComponent} from "./drag-and-drop-example/drag-and-drop-example.component";
import {TestCaseListComponent} from "./components/test-case-list/test-case-list.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DragAndDropExampleComponent, TestCaseListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dragon-tms';
}
