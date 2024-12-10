import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OneSignalProvider {
  private oneSignalApiUrl = 'https://onesignal.com/api/v1/notifications';
  private appId: string;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.appId = this.configService.get<string>('oneSignal.appId');
    this.apiKey = this.configService.get<string>('oneSignal.apiKey');
  }

  async sendPushNotification(userId: string, message: string) {
    const notification = {
      app_id: this.appId,
      contents: { en: message },
      include_player_ids: [userId],
    };

    try {
      const response = await axios.post(this.oneSignalApiUrl, notification, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error sending push notification');
    }
  }
}
