import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, throwError} from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Произошла ошибка';

      // Проверяем наличие поля errors в теле ответа
      if (error.error && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
        errorMessage = error.error.errors.join(', '); // Объединяем все сообщения об ошибках в одну строку
      }

      // Показать уведомление об ошибке с помощью MatSnackBar
      snackBar.open(errorMessage, 'Закрыть', {
        duration: 500000,
        panelClass: ['error-snackbar']
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
