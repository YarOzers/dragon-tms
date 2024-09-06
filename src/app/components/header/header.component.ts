import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {HeaderService} from "../../services/header.service";
import {filter} from "rxjs";
import {RouterParamsService} from "../../services/router-params.service";
import {User, UserDTO} from "../../models/user";
import {UserService} from "../../services/user.service";
import {KeycloakService} from "keycloak-angular";

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
  activeButton: string = 'testCases'; // По умолчанию активна кнопка 'Тест кейсы'

  // Method to toggle the icon
  showProjectButtons: boolean = false;
  private projectId: number | null = null;
  private userDTO: UserDTO = {
    id: 1, name: 'Yaroslav', rights: 2, role: 1
  };

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routeParamsService: RouterParamsService,
    private userService: UserService,
    private keycloakService: KeycloakService
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
    this.headerService.showButtons$.subscribe(show => {
      this.showProjectButtons = show;
    });

    this.userService.createUser(this.userDTO).subscribe(user=>{
      console.log("User was created:", this.userDTO)
    })

    // Subscribe to router events to check for active route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkActiveRoute();
    });
    this.checkActiveRoute();

  }

  checkActiveRoute() {
    const url = this.router.url;
    // Update the condition based on your route configuration
    if (url.includes('project')) {
      this.headerService.showButtons(true);
    } else {
      this.headerService.showButtons(false);
    }
  }

  goHome() {
    this.router.navigate([''])
  }

  ngAfterViewInit(): void {
  }

  goToTestPlans() {
    this.activeButton = 'testPlans';
    this.routeParamsService.projectId$.subscribe(id => {
      this.projectId = id;
    });
    this.router.navigate([`project/${this.projectId}`], {state: {go: true}})
  }

  goToTestCases() {
    this.activeButton = 'testCases';
    this.router.navigate([`project/${this.projectId}/testcases`], {state: {go: true}})
  }

  logout(){
    this.keycloakService.logout(window.location.origin).then(r =>{
      // Очистка локальных данных
      localStorage.clear();  // Например, очистка localStorage
      sessionStorage.clear(); // Очистка sessionStorage
      console.log('Данные пользователя очищены');
    }).catch(err => console.error('Ошибка при выходе', err));
  }
}
