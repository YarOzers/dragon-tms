import {Component, ViewChild} from '@angular/core';
import {ListProjectComponent} from "../project/list-project/list-project.component";
import {ThemeService} from "../../../styles/theme.service";
import {HeaderComponent} from "../header/header.component";
import {FlexModule} from "@angular/flex-layout";

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [
    ListProjectComponent,
    HeaderComponent,
    FlexModule
  ],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.css'
})
export class MainContainerComponent {
  @ViewChild('headerComponent') headerComponent!: HeaderComponent;
  constructor(private themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
