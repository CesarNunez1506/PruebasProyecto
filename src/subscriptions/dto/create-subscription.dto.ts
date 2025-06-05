import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID of the plan to subscribe to', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  planId: number;
}
