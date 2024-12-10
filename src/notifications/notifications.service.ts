import { Injectable } from '@nestjs/common';
import { OneSignalProvider } from './providers/onesignal.provider';

@Injectable()
export class NotificationsService {
  constructor(private readonly oneSignalProvider: OneSignalProvider) {}

  async notifyUserAboutBudgetExceed(userId: string, categoryAmount: number, expense: number, newTotalExpenses: number) {
    if (newTotalExpenses > categoryAmount * 0.7) {
      const message = `Warning: Your expense of $${expense} exceeds 70% of your budget of $${categoryAmount}. The current total expenses are now $${newTotalExpenses}.`;
      await this.oneSignalProvider.sendPushNotification(userId, message);
    }
  }
}
