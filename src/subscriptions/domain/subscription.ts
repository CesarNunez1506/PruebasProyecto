import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Plan } from '../../plans/domain/plan';
import { SubscriptionStatus } from './enums/subscription-status.enum';

const idType = Number;

export class Subscription {
  @ApiProperty({ type: idType })
  id: number | string;

  @ApiProperty({ type: () => Plan })
  plan: Plan;

  @ApiProperty({ type: () => User })
  worker: User; // The user (worker) who is subscribed to this plan

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ type: Date, example: '2025-01-01T00:00:00.000Z' })
  endDate: Date;

  @ApiProperty({ enum: SubscriptionStatus, enumName: 'SubscriptionStatus' })
  status: SubscriptionStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
