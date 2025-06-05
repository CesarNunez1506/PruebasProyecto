import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { ServiceEntity } from '../../../../../services/infrastructure/persistence/relational/entities/service.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'review' })
export class ReviewEntity extends EntityRelationalHelper {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: Number, minimum: 1, maximum: 5, example: 5 })
  @Column({ type: 'int' })
  rating: number;

  @ApiProperty({ type: String, nullable: true, example: 'Excellent service!' })
  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @ApiProperty({ type: () => ServiceEntity })
  @ManyToOne(() => ServiceEntity, { eager: true }) // Assuming service is often needed with review
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column({ type: Number }) // Foreign key column
  serviceId: number;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true }) // User who wrote the review
  @JoinColumn({ name: 'reviewerId' })
  reviewer: UserEntity;

  @Column({ type: Number }) // Foreign key column
  reviewerId: number;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true }) // User who is being reviewed
  @JoinColumn({ name: 'revieweeId' })
  reviewee: UserEntity;

  @Column({ type: Number }) // Foreign key column
  revieweeId: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
