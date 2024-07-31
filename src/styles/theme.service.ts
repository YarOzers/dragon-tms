import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: 'light-theme' | 'dark-theme' = 'light-theme';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  toggleTheme(): void {
    const theme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.setTheme(theme);
  }

  setTheme(theme: 'light-theme' | 'dark-theme'): void {
    const previousTheme = this.currentTheme;
    this.currentTheme = theme;
    const root = document.documentElement;
    this.renderer.removeClass(root, previousTheme);
    this.renderer.addClass(root, theme);
  }
}
