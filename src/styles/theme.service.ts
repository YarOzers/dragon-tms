import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: string = 'green-theme'; // Текущая тема по умолчанию
  private availableThemes: string[] = ['dark-theme','blue-theme','green-theme']; // Массив доступных тем

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // Переключение на следующую тему
  toggleTheme(): void {
    const currentIndex = this.availableThemes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.availableThemes.length; // Переход на следующую тему в цикле
    const nextTheme = this.availableThemes[nextIndex];
    this.setTheme(nextTheme);
  }

  // Установка конкретной темы
  setTheme(theme: string): void {
    const previousTheme = this.currentTheme;
    this.currentTheme = theme;
    const root = document.documentElement;

    // Удаляем предыдущую тему
    if (previousTheme) {
      this.renderer.removeClass(root, previousTheme);
    }

    // Добавляем новую тему
    this.renderer.addClass(root, theme);
  }

  // Получение текущей темы
  getCurrentTheme(): string {
    return this.currentTheme;
  }

  // Установка доступных тем (если необходимо изменять их динамически)
  setAvailableThemes(themes: string[]): void {
    this.availableThemes = themes;
  }
}
