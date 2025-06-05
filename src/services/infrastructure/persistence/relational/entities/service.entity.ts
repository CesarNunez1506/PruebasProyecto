import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { ServiceStatus } from 'src/services/domain/enums/service-status.enum'; // Changed path
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'service' })
export class ServiceEntity extends EntityRelationalHelper {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, example: 'Plumbing service for kitchen sink' })
  @Column({ type: String })
  title: string;

  @ApiProperty({ type: String, example: 'Fix leaky faucet and unclog drain.' })
  @Column({ type: 'text' }) // Using 'text' for potentially longer descriptions
  description: string;

  @ApiProperty({ enum: ServiceStatus, enumName: 'ServiceStatus' })
  @Column({ type: 'enum', enum: ServiceStatus })
  status: ServiceStatus;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true }) // Assuming client is always eagerly loaded
  @JoinColumn({ name: 'clientId' })
  client: UserEntity;

  @Column({ type: Number, nullable: true }) // Foreign key column
  clientId: number;

  @ApiProperty({ type: () => UserEntity, nullable: true })
  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'workerId' })
  worker?: UserEntity | null;

  @Column({ type: Number, nullable: true }) // Foreign key column
  workerId?: number | null;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date;
}
