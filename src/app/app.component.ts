import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

import {TreeComponent} from "./components/tree/tree.component";
import {ListProjectComponent} from "./components/project/list-project/list-project.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dragon-tms';
}
