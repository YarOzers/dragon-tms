import { Injectable } from '@angular/core';
import {environment} from "../environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TestCaseExportService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  downloadTestCases(testCaseIds: String[]): void {
    const headers = new HttpHeaders({
      'Accept': 'application/octet-stream' // Установите тип заголовка для получения бинарного файла
    });

    this.http.post<Blob>(`${this.apiUrl}/testcases/export`, testCaseIds,{ headers, responseType: 'blob' as 'json'}).subscribe((data: Blob) => {
      // Создайте ссылку для скачивания файла
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test_cases.xlsx'; // Имя файла
      a.click();
      URL.revokeObjectURL(url); // Освободите память
    }, error => {
      console.error('Ошибка при скачивании файла', error);
    });
  }
}
