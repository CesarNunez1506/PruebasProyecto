import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ServiceStatus } from '../domain/enums/service-status.enum';

export class UpdateServiceDto {
  @ApiPropertyOptional({ example: 'Advanced Plumbing Services' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Comprehensive installation and repair services.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ServiceStatus, enumName: 'ServiceStatus' })
  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;

  @ApiPropertyOptional({ description: 'ID of the worker assigned to the service. Should not be set by client directly.', example: 1 })
  @IsNumber()
  @IsOptional()
  workerId?: number; // This is more for internal service logic or admin updates
}
