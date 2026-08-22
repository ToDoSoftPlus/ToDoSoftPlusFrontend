import { Component, effect, input, output } from '@angular/core';
import { StatusNotificationData } from '../../models/status-notification.model';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-status-notification',
  imports: [KeyValuePipe],
  templateUrl: './status-notification.html',
  styleUrl: './status-notification.scss',
})
export class StatusNotification {
  notification = input<StatusNotificationData | null>(null);

  closed = output<void>();

  isClosing = false;

  private closeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const notification = this.notification();

      if (notification) {
        this.isClosing = false;
        this.startTimer();
      }
      console.log(notification);
      
    });
  }

  private startTimer(): void {
    this.clearTimer();

    this.closeTimer = setTimeout(() => {
      this.close();
    }, 4000);
  }

  close(): void {
    if (this.isClosing) {
      return;
    }

    this.isClosing = true;
    this.clearTimer();

    setTimeout(() => {
      this.closed.emit();
    }, 400);
  }

  private clearTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }
}
