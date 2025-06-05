import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './infrastructure/persistence/relational/entities/review.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { UsersModule } from '../users/users.module';
import { ServicesModule } from '../services/services.module'; // To inject ServicesService

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    UsersModule,    // If UsersService is needed
    ServicesModule, // To access ServicesService for validating service status etc.
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService], // Export if other modules need ReviewsService
})
export class ReviewsModule {}
