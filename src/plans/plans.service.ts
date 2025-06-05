import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from './infrastructure/persistence/relational/entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './domain/plan'; // Domain object

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<PlanEntity> {
    const newPlan = this.planRepository.create(createPlanDto);
    return this.planRepository.save(newPlan);
  }

  async findOne(id: number): Promise<PlanEntity> { // Changed return type
    const plan = await this.planRepository.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found.`);
    }
    return plan;
  }

  async findAll(): Promise<PlanEntity[]> {
    return this.planRepository.find();
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<PlanEntity> {
    const plan = await this.findOne(id); // findOne throws NotFoundException if not found
    // Object.assign(plan, updatePlanDto); // This is too simple, TypeORM might not track changes well
    const updatedPlan = this.planRepository.merge(plan, updatePlanDto);
    return this.planRepository.save(updatedPlan);
  }

  async remove(id: number): Promise<void> {
    const plan = await this.findOne(id); // Ensure plan exists before trying to delete
    await this.planRepository.remove(plan);
    // Or use: const result = await this.planRepository.delete(id);
    // if (result.affected === 0) {
    //   throw new NotFoundException(`Plan with ID ${id} not found.`);
    // }
  }
}
