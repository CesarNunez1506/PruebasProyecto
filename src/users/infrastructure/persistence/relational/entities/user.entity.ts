import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { UserType } from 'src/users/domain/enums/user-type.enum';
import { DocumentType } from 'src/users/domain/enums/document-type.enum';
import { VerificationStatus } from 'src/users/domain/enums/verification-status.enum';

import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  photo?: FileEntity | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty({ enum: UserType })
  @Column({
    type: 'enum',
    enum: UserType,
    nullable: true, // Set to true if it's optional, false otherwise
  })
  userType: UserType;

  @ApiProperty({ type: String, required: false })
  @Column({ type: String, nullable: true })
  phone?: string;

  @ApiProperty({ type: String, required: false })
  @Column({ type: String, nullable: true })
  address?: string;

  @ApiProperty({ enum: DocumentType, required: false })
  @Column({
    type: 'enum',
    enum: DocumentType,
    nullable: true,
  })
  documentType?: DocumentType;

  @ApiProperty({ type: () => FileEntity, required: false })
  @ManyToOne(() => FileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  documentFile?: FileEntity | null;

  @ApiProperty({
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
    required: false,
  })
  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus?: VerificationStatus;
}
