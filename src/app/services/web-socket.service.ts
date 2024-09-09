import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client'; // Исправленный импорт
import {BehaviorSubject, Observable} from 'rxjs';
import {AutotestResult} from "../models/autotest-result";
import {environment} from "../environment";
import { KeycloakService } from 'keycloak-angular'; // Импорт KeycloakService для получения токена

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private wsUrl = environment.wsUrl;
  private stompClient: any;
  private testStatusSubject = new BehaviorSubject<any>(null);
  testStatus$: Observable<AutotestResult[]> = this.testStatusSubject.asObservable();

  constructor(private keycloakService: KeycloakService) {} // Добавляем KeycloakService в конструктор

  async connect() {
    const token = await this.keycloakService.getToken(); // Получаем токен от Keycloak

    const socket = new SockJS(`${this.wsUrl}`);
    this.stompClient = Stomp.over(<WebSocket>socket);

    // Проверьте, выводится ли корректный токен
    console.log('Bearer Token:', token);

    this.stompClient.connect({
      Authorization: `Bearer ${token}`  // Добавляем токен в заголовок
    }, (frame: any) => {
      console.log('Connected: ' + frame);

      this.stompClient.subscribe('/topic/test-status/1', (message: any) => {
        if (message.body) {
          this.testStatusSubject.next(JSON.parse(message.body));
        }
      });
    }, (error: any) => {
      console.error('Error during WebSocket connection:', error);
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }
}
