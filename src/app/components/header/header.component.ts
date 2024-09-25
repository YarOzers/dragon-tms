import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {FlexLayoutModule, MediaObserver} from "@angular/flex-layout";
import {MatIcon} from "@angular/material/icon";
import {NgForOf, NgIf} from "@angular/common";
import {HeaderService} from "../../services/header.service";
import {filter} from "rxjs";
import {RouterParamsService} from "../../services/router-params.service";
import {UserDTO} from "../../models/user";
import {UserService} from "../../services/user.service";
import {KeycloakService} from "keycloak-angular";
import {jwtDecode} from "jwt-decode";
import {AuthService} from "../../services/auth.service";
import {DecodedToken} from "../../models/token";
import {MatDialog} from "@angular/material/dialog";
import {SupportDialogComponent} from "../support-dialog/support-dialog.component";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatToolbarRow} from "@angular/material/toolbar";
import {ThemeService} from "../../../styles/theme.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButton,
    RouterOutlet,
    FlexLayoutModule,
    MatIconButton,
    MatIcon,
    NgIf,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatToolbarRow,
    NgForOf
  ],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss'
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output() notifyMain: EventEmitter<void> = new EventEmitter<void>();
  matIcon: string = 'wb_sunny';
  activeButton: string = 'testCases'; // По умолчанию активна кнопка 'Тест кейсы'
  menuOpen: boolean = false;
  themes: string[] = [];


  // Method to toggle the icon
  showProjectButtons: boolean = false;
  private projectId: number | null = null;
  userName: string = 'Имя пользователя';


  constructor(
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routeParamsService: RouterParamsService,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private authService: AuthService,
    private dialog: MatDialog,
    private mediaObserver: MediaObserver,
    private themeService: ThemeService
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
    if (localStorage.getItem('theme')){
      this.themeService.setTheme(localStorage.getItem('theme'));
    }

    this.themes = this.themeService.getAvailableThemes();
    this.headerService.showButtons$.subscribe(show => {
      this.showProjectButtons = show;
    });

    const token = this.authService.getAccessToken();

    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      console.log("DECODED_TOKEN::", decodedToken);

      const roles: string[] = decodedToken?.realm_access!.roles;
      const parsedToken = this.authService.getTokenParsed();
      console.log("Parsed token::", parsedToken);
      const user: UserDTO = {
        roles: roles,
        name: parsedToken.name,
        email: parsedToken.email
      }
      this.userName = parsedToken.given_name;
      console.log("USER::::", user);

      this.userService.createUser(user).subscribe(returnedUser => {
        this.userService.setUser(returnedUser);
        console.log("User was created:", returnedUser);
      })
    }


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

  goToProjectList() {
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

  goToTestRuns() {
    this.activeButton = 'testRuns';
    this.router.navigate([`project/${this.projectId}/test-runs`], {state: {go: true}})
  }

  logout() {
    this.keycloakService.logout(window.location.origin).then(r => {
      // Очистка локальных данных
      localStorage.clear();  // Например, очистка localStorage
      sessionStorage.clear(); // Очистка sessionStorage
      console.log('Данные пользователя очищены');
    }).catch(err => console.error('Ошибка при выходе', err));
  }


  openSupportDialog() {
    const isSmallScreen = this.mediaObserver.isActive('ld-md');
    const dialogRef = this.dialog.open(SupportDialogComponent, {

      width: isSmallScreen ? '95%' : '65%',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {} // Можно передать данные в диалоговое окно
    });
  }

  setTheme(theme: string) {
    this.themeService.setTheme(theme);
  }

  getDisplayThemeName(tm: string): string {
    const displayNames: { [key: string]: string } = {
      'dark-theme': 'dark',
      'blue-theme': 'blue',
      'green-theme': 'green',
      'crab-theme': 'crab',
      'blue-dark-theme': 'blue dark'
    }
    return displayNames[tm];
  }
}
