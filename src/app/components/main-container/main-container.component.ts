import { Component } from '@angular/core';
import {ListProjectComponent} from "../project/list-project/list-project.component";
import {ThemeService} from "../../../styles/theme.service";

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [
    ListProjectComponent
  ],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.css'
})
export class MainContainerComponent {
  constructor(private themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
