import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {HeaderService} from "../../services/header.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButton,
    RouterOutlet,
    FlexLayoutModule,
    MatIconButton,
    MatIcon,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output() notifyMain: EventEmitter<void> = new EventEmitter<void>();
  matIcon: string = 'wb_sunny';

  // Method to toggle the icon
  showProjectButtons: boolean = false;

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  toggleIcon(): void {
    this.callMainFunction();
    this.matIcon = this.matIcon === 'brightness_2' ? 'wb_sunny' : 'brightness_2';

  }

  callMainFunction() {
    this.notifyMain.emit();
  }

  ngOnInit() {
    console.log(this.router.url)
    this.headerService.showButtons$.subscribe(show => {
      this.showProjectButtons = show;
    });

    // Subscribe to router events to check for active route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      console.log("сюда заходит?")
      this.checkActiveRoute();
    });
    console.log("сюда заходит,,,,,,,,,,,,,,?")
    this.checkActiveRoute();
  }

  checkActiveRoute() {
    const url = this.router.url;
    // Update the condition based on your route configuration
    if (url.includes('project-detail')) {
      this.headerService.showButtons(true);
    } else {
      this.headerService.showButtons(false);
    }
  }

  goHome() {
    console.log('Go home was clicked!!!')
    this.router.navigate([''])
  }

  ngAfterViewInit(): void {
  }
}
