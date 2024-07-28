import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButton,
    RouterOutlet
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
}
