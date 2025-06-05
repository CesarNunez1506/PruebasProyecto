import { PartialType, ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { Transform, Type } from 'class-transformer';
import { IsEmail, IsOptional, MinLength, IsString, IsEnum, IsUUID } from 'class-validator'; // Changed IsNumber to IsUUID
import { DocumentType } from '../domain/enums/document-type.enum';
import { VerificationStatus } from '../domain/enums/verification-status.enum';
// FileDto might be used if we want to allow passing full file info,
// but typically for updates, an ID is sufficient if the file is already uploaded.
// import { FileDto } from '../../files/dto/file.dto';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusDto } from '../../statuses/dto/status.dto';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiPropertyOptional({ example: 'John', type: String })
  @IsOptional()
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Doe', type: String })
  @IsOptional()
  lastName?: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ type: () => RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @ApiPropertyOptional({ type: () => StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;

  // phone and address are already in CreateUserDto, so PartialType makes them optional.
  // We can add explicit @ApiPropertyOptional if not already clear.
  @ApiPropertyOptional({ example: '1234567890', type: String })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St, Anytown, USA', type: String })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: DocumentType, enumName: 'DocumentType' })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({ type: String, format: 'uuid', description: 'ID of the uploaded document file' })
  @IsOptional()
  @IsUUID() // Use IsUUID for validation if the ID is a UUID
  documentFileId?: string;

  @ApiPropertyOptional({ enum: VerificationStatus, enumName: 'VerificationStatus' })
  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;
}
