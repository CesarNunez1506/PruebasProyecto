import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './infrastructure/persistence/relational/entities/plan.entity';
import { SubscriptionEntity } from '../subscriptions/infrastructure/persistence/relational/entities/subscription.entity'; // Corrected path
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { SubscriptionsController } from '../subscriptions/subscriptions.controller';
import { UsersModule } from '../users/users.module'; // For injecting UsersService
// Import RolesModule if RolesGuard is used in PlansController for admin roles
// import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanEntity, SubscriptionEntity]),
    UsersModule,
    // RolesModule, // If RolesGuard and Roles decorator rely on it
  ],
  controllers: [PlansController, SubscriptionsController],
  providers: [PlansService, SubscriptionsService],
  exports: [PlansService, SubscriptionsService], // Export if other modules need them
})
export class PlansModule {}
