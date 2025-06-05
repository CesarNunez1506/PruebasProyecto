import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { ServiceStatus } from './enums/service-status.enum';

const idType = Number;

export class Service {
  @ApiProperty({ type: idType })
  id: number | string;

  @ApiProperty({ type: String, example: 'Plumbing service for kitchen sink' })
  title: string;

  @ApiProperty({ type: String, example: 'Fix leaky faucet and unclog drain.' })
  description: string;

  @ApiProperty({ enum: ServiceStatus, enumName: 'ServiceStatus' })
  status: ServiceStatus;

  @ApiProperty({ type: () => User })
  client: User;

  @ApiProperty({ type: () => User, nullable: true })
  worker?: User | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt?: Date;
}
