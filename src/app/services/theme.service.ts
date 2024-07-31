import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private activeTheme: 'light-theme' | 'dark-theme' = 'light-theme';

  constructor() {
    this.loadTheme();
  }

  setTheme(theme: 'light-theme' | 'dark-theme') {
    document.body.classList.remove(this.activeTheme);
    this.activeTheme = theme;
    document.body.classList.add(this.activeTheme);
    localStorage.setItem('theme', this.activeTheme);
  }

  toggleTheme() {
    const newTheme = this.activeTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.setTheme(newTheme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') as 'light-theme' | 'dark-theme';
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme(this.activeTheme);
    }
  }

  get currentTheme() {
    return this.activeTheme;
  }
}
