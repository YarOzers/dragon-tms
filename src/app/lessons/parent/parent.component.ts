import {Component, ViewChild} from '@angular/core';
import {ExampleComponent} from "../example/example.component";
import {ChildComponent} from "../child/child.component";

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [
    ExampleComponent,
    ChildComponent
  ],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {
  newMessage: string = 'new message'
  message: string = '';


  setNewMessage() {
    this.newMessage = "Has just was shown new message!!!"
  }

  receiveMessage($event: string){
    this.message = $event;
  }
}
