import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private showButtonsSource = new BehaviorSubject<boolean>(false);
  showButtons$ = this.showButtonsSource.asObservable();

  showButtons(show: boolean) {
    this.showButtonsSource.next(show);
  }
  constructor() { }
}
