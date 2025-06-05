import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query, // For checkWorkerAvailability if exposed via GET
  NotFoundException,
  ForbiddenException,
  ValidationPipe, // For CreateAvailabilityDto array
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { Availability } from './domain/availability';
import { User } from '../users/domain/user';
import { UserType } from '../users/domain/enums/user-type.enum';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: [Availability] })
  setMyAvailability(
    @Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })) createAvailabilityDtos: CreateAvailabilityDto[],
    @Req() request: { user: User },
  ): Promise<Availability[]> {
    if (request.user.userType !== UserType.WORKER) {
      throw new ForbiddenException('Only workers can set their availability.');
    }
    return this.availabilityService.setAvailability(createAvailabilityDtos, request.user);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({ type: [Availability] })
  getMyAvailability(@Req() request: { user: User }): Promise<Availability[]> {
     if (request.user.userType !== UserType.WORKER) {
      throw new ForbiddenException('Only workers can view their own availability directly.');
    }
    return this.availabilityService.getAvailability(request.user.id);
  }

  @Get('/worker/:workerId')
  @ApiOkResponse({ type: [Availability] }) // Public or JWT-guarded
  getWorkerAvailability(@Param('workerId', ParseIntPipe) workerId: number): Promise<Availability[]> {
    return this.availabilityService.getAvailability(workerId);
  }

  @Delete('/me/:availabilityId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Availability slot deleted successfully' })
  async removeMyAvailability(
    @Param('availabilityId', ParseIntPipe) availabilityId: number,
    @Req() request: { user: User },
  ): Promise<void> {
    if (request.user.userType !== UserType.WORKER) {
      throw new ForbiddenException('Only workers can remove their availability.');
    }
    await this.availabilityService.removeAvailability(availabilityId, request.user);
  }

  // Optional: Endpoint to check specific availability slot for a worker
  // @Get('/check/:workerId')
  // @ApiOkResponse({ type: Boolean })
  // checkWorkerAvailability(
  //   @Param('workerId', ParseIntPipe) workerId: number,
  //   @Query('dateTime') dateTimeString: string, // Expect ISO date string
  // ) {
  //   const dateTime = new Date(dateTimeString);
  //   if (isNaN(dateTime.getTime())) {
  //       throw new UnprocessableEntityException('Invalid date format for dateTime query parameter.');
  //   }
  //   return this.availabilityService.checkWorkerAvailability(workerId, dateTime);
  // }
}
