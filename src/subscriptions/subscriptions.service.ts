import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './infrastructure/persistence/relational/entities/subscription.entity'; // Corrected path
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { User } from '../users/domain/user';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity'; // Import UserEntity
import { UsersService } from '../users/users.service';
import { PlansService } from '../plans/plans.service';
import { PlanEntity } from '../plans/infrastructure/persistence/relational/entities/plan.entity'; // Import PlanEntity
import { SubscriptionStatus } from './domain/enums/subscription-status.enum';
import { Subscription } from './domain/subscription'; // Corrected path & Domain object for Subscription
// Plan domain object is not directly used here if PlanEntity is used for relations

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly plansService: PlansService,
    private readonly usersService: UsersService, // To ensure worker exists, etc.
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, worker: User): Promise<SubscriptionEntity> {
    const { planId } = createSubscriptionDto;

    const plan = await this.plansService.findOne(planId);
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found.`);
    }

    // Check if worker already has an active subscription
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        worker: { id: worker.id },
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (existingSubscription) {
      throw new UnprocessableEntityException('Worker already has an active subscription.');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); // Assuming a 30-day subscription period

    const subscription = this.subscriptionRepository.create({
      plan: { id: plan.id } as PlanEntity, // Ensure it's a partial PlanEntity
      worker: { id: Number(worker.id) } as UserEntity, // Ensure ID is number and cast to UserEntity partial
      startDate,
      endDate,
      status: SubscriptionStatus.ACTIVE, // Or PENDING_PAYMENT if payment is integrated
    });

    return this.subscriptionRepository.save(subscription);
  }

  async findByWorker(workerId: number): Promise<SubscriptionEntity | null> {
    return this.subscriptionRepository.findOne({
      where: { worker: { id: workerId } },
      relations: ['plan'], // Eagerly load plan details
      order: { createdAt: 'DESC' }, // Get the latest subscription if multiple exist (e.g. past ones)
    });
  }

  async handlePaymentSuccess(paymentIntentId: string, metadata: any): Promise<void> {
    // Example: metadata might contain subscriptionId or workerId
    const subscriptionId = metadata.subscriptionId;
    if (!subscriptionId) {
      console.error('Subscription ID missing in payment metadata');
      return;
    }
    const subscription = await this.subscriptionRepository.findOneBy({id: subscriptionId});
    if (subscription) {
      subscription.status = SubscriptionStatus.ACTIVE;
      // Potentially update startDate/endDate based on payment date
      await this.subscriptionRepository.save(subscription);
      console.log(`Subscription ${subscriptionId} activated successfully.`);
    } else {
      console.error(`Subscription with ID ${subscriptionId} not found for payment ${paymentIntentId}.`);
    }
  }

  async cancelSubscription(subscriptionId: number, worker: User): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOne({
        where: { id: subscriptionId, worker: { id: worker.id } },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${subscriptionId} not found or does not belong to this worker.`);
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new UnprocessableEntityException('Subscription is already cancelled.');
    }

    // For now, immediate cancellation. Could be changed to cancel at end of period.
    subscription.status = SubscriptionStatus.CANCELLED;
    // Optionally, set endDate to now or keep original endDate
    // subscription.endDate = new Date();

    return this.subscriptionRepository.save(subscription);
  }
}
