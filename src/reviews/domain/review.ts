import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { Service } from '../../services/domain/service';

const idType = Number;

export class Review {
  @ApiProperty({ type: idType })
  id: number | string;

  @ApiProperty({ type: Number, minimum: 1, maximum: 5, example: 5 })
  rating: number;

  @ApiProperty({ type: String, nullable: true, example: 'Excellent service!' })
  comment?: string | null;

  @ApiProperty({ type: () => Service })
  service: Service;

  @ApiProperty({ type: () => User })
  reviewer: User; // User who wrote the review

  @ApiProperty({ type: () => User })
  reviewee: User; // User who is being reviewed (e.g., the worker)

  @ApiProperty()
  createdAt: Date;
}
