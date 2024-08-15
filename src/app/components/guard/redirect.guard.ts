import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const redirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Проверка, если это не обычная навигация в приложении, а перезагрузка страницы или прямой переход по URL
  if (!router.getCurrentNavigation()?.extras?.state?.['go']) {
    router.navigate(['/']);  // Перенаправляем на корневой маршрут
    return false;  // Предотвращаем переход по исходному маршруту
  }

  return true;  // Разрешаем переход на маршрут
};
