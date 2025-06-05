import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'Basic Plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: [String], example: ['Feature 1', 'Feature 2'] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  features: string[];
}
