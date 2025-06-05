import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './domain/plan';
import { RolesGuard } from '../roles/roles.guard'; // Assuming RolesGuard exists
import { Roles } from '../roles/roles.decorator'; // Assuming Roles decorator exists
import { RoleEnum } from '../roles/roles.enum'; // Assuming RoleEnum exists

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // Public endpoint to list plans
  @Get()
  @ApiOkResponse({ type: [Plan] })
  findAll(): Promise<Plan[]> {
    return this.plansService.findAll();
  }

  // Admin only endpoints
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiCreatedResponse({ type: Plan })
  create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.plansService.create(createPlanDto);
  }

  @Get(':id')
  // Making this public or JWT-guarded without admin role for users to view plan details
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({ type: Plan })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Plan | null> {
    const plan = await this.plansService.findOne(id);
    if (!plan) {
        // Service already throws NotFoundException, but controller can also handle if needed
        // Or rely on service's exception to propagate
    }
    return plan;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiOkResponse({ type: Plan })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlanDto: UpdatePlanDto): Promise<Plan> {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiOkResponse({ description: 'Plan deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.plansService.remove(id);
  }
}
