import {Component} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-drag-and-drop-example',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    NgForOf,
    NgIf,
    CdkDropListGroup
  ],
  templateUrl: './drag-and-drop-example.component.html',
  styleUrl: './drag-and-drop-example.component.css'
})
export class DragAndDropExampleComponent {
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
