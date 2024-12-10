import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OneSignalProvider } from './providers/onesignal.provider';
import { NotificationsService } from './notifications.service';
import oneSignalConfig from 'src/common/config/onesignal-config';

@Module({
  imports: [ConfigModule.forRoot({ load: [oneSignalConfig] })],
  providers: [OneSignalProvider, NotificationsService],
  exports: [NotificationsService], 
})
export class NotificationsModule {}
