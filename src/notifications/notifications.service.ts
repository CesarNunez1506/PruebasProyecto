import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { User } from '../users/domain/user';
import { Service } from '../services/domain/service'; // Assuming Service domain object
import { Review } from '../reviews/domain/review';   // Assuming Review domain object

@Injectable()
export class NotificationsService {
  constructor(private readonly mailService: MailService) {}

  async sendTaskAcceptedNotification(service: Service, client: User): Promise<void> {
    // Assuming MailService has a method like this, or a generic sendMail with template
    await this.mailService.sendMail({
      to: client.email,
      subject: `Your Service Request "${service.title}" has been Accepted!`,
      templateName: 'taskAccepted', // Hypothetical template name
      context: {
        clientName: client.firstName,
        serviceTitle: service.title,
        workerName: service.worker?.firstName, // Assuming worker is populated
        // Add any other relevant details for the email template
      },
    });
    console.log(`Sent task accepted email to ${client.email} for service ${service.title}`);
  }

  async sendTaskCompletedNotification(service: Service, recipient: User): Promise<void> {
    await this.mailService.sendMail({
      to: recipient.email,
      subject: `Service Request "${service.title}" Marked as Completed`,
      templateName: 'taskCompleted', // Hypothetical template name
      context: {
        userName: recipient.firstName,
        serviceTitle: service.title,
        // Add any other relevant details
      },
    });
    console.log(`Sent task completed email to ${recipient.email} for service ${service.title}`);
  }

  async sendNewReviewNotification(review: Review, reviewee: User): Promise<void> {
    await this.mailService.sendMail({
      to: reviewee.email,
      subject: `You've Received a New Review!`,
      templateName: 'newReview', // Hypothetical template name
      context: {
        revieweeName: reviewee.firstName,
        serviceTitle: review.service.title, // Assuming review.service is populated enough
        reviewerName: review.reviewer.firstName, // Assuming review.reviewer is populated
        rating: review.rating,
        comment: review.comment,
      },
    });
    console.log(`Sent new review notification to ${reviewee.email} for service ${review.service.title}`);
  }
}
