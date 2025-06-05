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
import { DayOfWeek } from 'src/availability/domain/enums/day-of-week.enum'; // Changed path
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'availability' })
export class AvailabilityEntity extends EntityRelationalHelper {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity) // A worker can have multiple availability slots
  @JoinColumn({ name: 'workerId' })
  worker: UserEntity;

  @Column({ type: Number }) // Foreign key column
  workerId: number;

  @ApiProperty({ enum: DayOfWeek, enumName: 'DayOfWeek', example: DayOfWeek.MONDAY })
  @Column({ type: 'enum', enum: DayOfWeek })
  dayOfWeek: DayOfWeek;

  @ApiProperty({ type: String, example: '09:00' })
  @Column({ type: 'time' }) // Using 'time' type for HH:mm format
  startTime: string;

  @ApiProperty({ type: String, example: '17:00' })
  @Column({ type: 'time' }) // Using 'time' type for HH:mm format
  endTime: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
