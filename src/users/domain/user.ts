import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { Role } from '../../roles/domain/role';
import { UserType } from './enums/user-type.enum';
import { DocumentType } from './enums/document-type.enum';
import { VerificationStatus } from './enums/verification-status.enum';
import { Status } from '../../statuses/domain/status';
import { ApiProperty } from '@nestjs/swagger';

const idType = Number;

export class User {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({
    type: String,
    example: 'email',
  })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: () => FileType,
  })
  photo?: FileType | null;

  @ApiProperty({
    type: () => Role,
  })
  role?: Role | null;

  @ApiProperty({
    type: () => Status,
  })
  status?: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({ enum: UserType })
  userType: UserType;

  @ApiProperty({ type: String, required: false })
  phone?: string;

  @ApiProperty({ type: String, required: false })
  address?: string;

  @ApiProperty({ enum: DocumentType, required: false })
  documentType?: DocumentType;

  @ApiProperty({ type: () => FileType, required: false })
  documentFile?: FileType | null;

  @ApiProperty({
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
    required: false,
  })
  verificationStatus?: VerificationStatus;
}
