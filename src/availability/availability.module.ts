import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityEntity } from './infrastructure/persistence/relational/entities/availability.entity';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { UsersModule } from '../users/users.module'; // If UsersService is needed or for user context

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailabilityEntity]),
    UsersModule, // Provides User context if needed by guards/decorators or service implicitly
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService], // Export if other modules (e.g. ServicesService) need it
})
export class AvailabilityModule {}
