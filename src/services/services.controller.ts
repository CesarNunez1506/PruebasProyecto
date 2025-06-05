import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query, // For future pagination/filtering
  NotFoundException, // Import NotFoundException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './domain/service'; // Assuming Service domain object for response types
import { User } from '../users/domain/user'; // For request.user type

@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiCreatedResponse({ type: Service })
  create(@Body() createServiceDto: CreateServiceDto, @Req() request: { user: User }): Promise<Service> {
    return this.servicesService.create(createServiceDto, request.user);
  }

  @Get()
  @ApiOkResponse({ type: [Service] })
  findAll(@Query() queryOptions: any) { // Replace 'any' with a proper QueryDTO later
    return this.servicesService.findAll(queryOptions);
  }

  @Get(':id')
  @ApiOkResponse({ type: Service })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Service | null> {
    const service = await this.servicesService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }
    return service;
  }

  @Patch(':id')
  @ApiOkResponse({ type: Service })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @Req() request: { user: User },
  ): Promise<Service> {
    return this.servicesService.update(id, updateServiceDto, request.user);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Service deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request: { user: User }): Promise<void> {
    await this.servicesService.remove(id, request.user);
  }
}
