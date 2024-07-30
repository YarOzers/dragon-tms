import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

import {TreeComponent} from "./components/tree/tree.component";
import {ListProjectComponent} from "./components/project/list-project/list-project.component";
import {ExampleComponent} from "./lessons/example/example.component";
import {ParentComponent} from "./lessons/parent/parent.component";
import {OneMoreComponent} from "./lessons/one-more/one-more.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TreeComponent, ListProjectComponent, ExampleComponent, ParentComponent, OneMoreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dragon-tms';
}
