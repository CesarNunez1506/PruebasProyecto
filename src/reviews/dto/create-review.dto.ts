import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID of the service being reviewed', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty({ description: 'Rating from 1 to 5', example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiPropertyOptional({ description: 'Optional comment for the review', example: 'Excellent service!' })
  @IsString()
  @IsOptional()
  comment?: string;
}
