import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'plan' })
export class PlanEntity extends EntityRelationalHelper {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, example: 'Premium Plan' })
  @Column({ type: String, unique: true }) // Assuming plan names are unique
  name: string;

  @ApiProperty({ type: Number, example: 29.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Suitable for currency
  price: number;

  @ApiProperty({
    type: [String],
    example: ['Access to all features', '24/7 Support', 'Monthly reports'],
  })
  @Column({ type: 'simple-array' })
  features: string[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
