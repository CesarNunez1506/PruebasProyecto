import { Injectable, NotFoundException, UnprocessableEntityException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './infrastructure/persistence/relational/entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from '../users/domain/user';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';
import { ServiceStatus } from '../services/domain/enums/service-status.enum';
import { UserType } from '../users/domain/enums/user-type.enum';
import { Review } from './domain/review'; // Assuming Review domain object
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity'; // Import UserEntity
import { ServiceEntity } from '../services/infrastructure/persistence/relational/entities/service.entity'; // Import ServiceEntity

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly servicesService: ServicesService,
    private readonly usersService: UsersService, // May not be needed if User object passed in is sufficient
  ) {}

  async create(createReviewDto: CreateReviewDto, reviewer: User): Promise<ReviewEntity> {
    const { serviceId, rating, comment } = createReviewDto;

    const service = await this.servicesService.findOne(serviceId);
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found.`);
    }

    if (service.status !== ServiceStatus.COMPLETED) {
      throw new UnprocessableEntityException('Cannot review a service that is not completed.');
    }

    let revieweeId: number;
    if (reviewer.userType === UserType.CLIENT && service.worker) {
      // Client is reviewing the worker
      revieweeId = service.worker.id;
      if (reviewer.id !== service.client.id) {
        throw new ForbiddenException('You are not authorized to review this service as this client.');
      }
    } else if (reviewer.userType === UserType.WORKER && service.worker) {
      // Worker is reviewing the client
      revieweeId = service.client.id;
      if (reviewer.id !== service.worker.id) {
        throw new ForbiddenException('You are not authorized to review this service as this worker.');
      }
    } else {
      throw new UnprocessableEntityException('Invalid reviewer type or service state for review.');
    }

    // Check for duplicate reviews: one review per (reviewerId, serviceId, revieweeId)
    // More specific: a reviewer should only review a reviewee once for a given service.
    const existingReview = await this.reviewRepository.findOne({
      where: {
        service: { id: serviceId },
        reviewer: { id: reviewer.id },
        reviewee: { id: revieweeId },
      },
    });

    if (existingReview) {
      throw new UnprocessableEntityException('You have already submitted a review for this party on this service.');
    }

    const review = this.reviewRepository.create({
      rating,
      comment,
      service: { id: serviceId } as ServiceEntity, // Cast to ServiceEntity partial
      reviewer: { id: Number(reviewer.id) } as UserEntity, // Ensure ID is number, cast to UserEntity partial
      reviewee: { id: Number(revieweeId) } as UserEntity, // Ensure ID is number, cast to UserEntity partial
    });

    return this.reviewRepository.save(review);
  }

  async findByService(serviceId: number): Promise<ReviewEntity[]> {
    return this.reviewRepository.find({
      where: { service: { id: serviceId } },
      relations: ['reviewer', 'reviewee', 'service'],
    });
  }

  async findByReviewee(revieweeId: number): Promise<ReviewEntity[]> {
    return this.reviewRepository.find({
      where: { reviewee: { id: revieweeId } },
      relations: ['reviewer', 'service'], // Service might be useful context
    });
  }

  // Optional: findOne, update, delete if needed later
}
