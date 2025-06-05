import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from './infrastructure/persistence/relational/entities/service.entity';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { UsersModule } from '../users/users.module'; // To inject UsersService

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity]),
    UsersModule, // Make UsersService available for injection
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService], // Export if other modules need ServicesService
})
export class ServicesModule {}
