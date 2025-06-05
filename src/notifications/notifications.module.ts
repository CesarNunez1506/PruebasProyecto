import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailModule } from '../mail/mail.module'; // To inject MailService

@Module({
  imports: [MailModule], // Make MailService available
  providers: [NotificationsService],
  exports: [NotificationsService], // Export if other modules need to trigger notifications
})
export class NotificationsModule {}
