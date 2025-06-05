import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  Query, // For future pagination/filtering
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './domain/review'; // Assuming Review domain object for response types
import { User } from '../users/domain/user'; // For request.user type

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiCreatedResponse({ type: Review })
  create(@Body() createReviewDto: CreateReviewDto, @Req() request: { user: User }): Promise<Review> {
    return this.reviewsService.create(createReviewDto, request.user);
  }

  @Get('service/:serviceId')
  @ApiOkResponse({ type: [Review] })
  findByService(@Param('serviceId', ParseIntPipe) serviceId: number): Promise<Review[]> {
    return this.reviewsService.findByService(serviceId);
  }

  @Get('user/:userId') // Reviews *about* a specific user (reviewee)
  @ApiOkResponse({ type: [Review] })
  findByReviewee(@Param('userId', ParseIntPipe) userId: number): Promise<Review[]> {
    return this.reviewsService.findByReviewee(userId);
  }
}
