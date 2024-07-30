import { Component } from '@angular/core';
import {ExampleComponent} from "../example/example.component";

@Component({
  selector: 'app-one-more',
  standalone: true,
  imports: [
    ExampleComponent
  ],
  templateUrl: './one-more.component.html',
  styleUrl: './one-more.component.css'
})
export class OneMoreComponent {

}
