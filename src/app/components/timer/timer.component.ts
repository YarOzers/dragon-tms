import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    FlexModule
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit, OnDestroy {
  time: number = 0; // Хранение времени в секундах
  interval: any;
  isPaused: boolean = false;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (!this.isPaused) {
        this.time++;
      }
    }, 1000);
  }

  pauseTimer() {
    this.isPaused = true;
  }

  resumeTimer() {
    this.isPaused = false;
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  resetTimer() {
    this.clearTimer();
    this.time = 0;
    this.isPaused = false;
    this.startTimer();
  }

  formatTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return (
      this.padNumber(hours) + ':' +
      this.padNumber(minutes) + ':' +
      this.padNumber(seconds)
    );
  }

  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
