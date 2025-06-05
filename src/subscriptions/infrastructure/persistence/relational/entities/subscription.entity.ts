import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { PlanEntity } from '../../../../../plans/infrastructure/persistence/relational/entities/plan.entity';
import { SubscriptionStatus } from 'src/subscriptions/domain/enums/subscription-status.enum'; // Changed path
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'subscription' })
export class SubscriptionEntity extends EntityRelationalHelper {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => PlanEntity })
  @ManyToOne(() => PlanEntity, { eager: true }) // Assuming plan details are often needed
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;

  @Column({ type: Number }) // Foreign key column
  planId: number;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true }) // The worker subscribed
  @JoinColumn({ name: 'workerId' })
  worker: UserEntity;

  @Column({ type: Number }) // Foreign key column
  workerId: number;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z' })
  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @ApiProperty({ type: Date, example: '2025-01-01T00:00:00.000Z' })
  @Column({ type: 'timestamp with time zone' })
  endDate: Date;

  @ApiProperty({ enum: SubscriptionStatus, enumName: 'SubscriptionStatus' })
  @Column({ type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
