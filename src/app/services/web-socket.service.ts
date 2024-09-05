import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client'; // Исправленный импорт
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private testStatusSubject = new BehaviorSubject<any>(null);
  testStatus$ = this.testStatusSubject.asObservable();

  constructor() { }

  connect() {
    const socket = new SockJS('http://localhost:9111/ws');
    this.stompClient = Stomp.over(<WebSocket>socket);

    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);

      // Подписываемся на обновление статусов тестов для конкретного пользователя
      this.stompClient.subscribe('/topic/test-status/1', (message: any) => {
        if (message.body) {
          this.testStatusSubject.next(JSON.parse(message.body));
        }
      });
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }
}
