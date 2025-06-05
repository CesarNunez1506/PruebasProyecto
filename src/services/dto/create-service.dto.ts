import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Professional Plumbing Services' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Installation and repair of pipes, fixtures, and other plumbing systems.' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
