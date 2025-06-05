import { Injectable, NotFoundException, ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from './infrastructure/persistence/relational/entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { User } from '../users/domain/user'; // Assuming User domain object for type hint
import { UsersService } from '../users/users.service';
import { ServiceStatus } from './domain/enums/service-status.enum';
import { UserType } from '../users/domain/enums/user-type.enum';
import { Service } from './domain/service'; // Assuming Service domain object
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity'; // Import UserEntity

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    private readonly usersService: UsersService,
  ) {}

  async create(createServiceDto: CreateServiceDto, client: User): Promise<ServiceEntity> {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      client: { id: Number(client.id) } as UserEntity, // Ensure ID is number, cast to UserEntity partial
      status: ServiceStatus.PENDING,
      // worker will be null initially
    });
    return this.serviceRepository.save(service);
  }

  async findOne(id: number): Promise<ServiceEntity | null> {
    return this.serviceRepository.findOne({
      where: { id },
      relations: ['client', 'worker'],
    });
  }

  async findAll(queryOptions?: any): Promise<ServiceEntity[]> {
    // Basic implementation, can be expanded with pagination/filtering
    // For now, returns all services. Add query builder for filters later.
    return this.serviceRepository.find({ relations: ['client', 'worker'] });
  }

  async update(id: number, updateServiceDto: UpdateServiceDto, currentUser: User): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({ where: {id}, relations: ['client', 'worker'] });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    // Logic for updating status and fields based on user role and service status
    const { title, description, status, workerId } = updateServiceDto;

    // Client can modify title/description if service is PENDING
    if (currentUser.id === service.client.id && service.status === ServiceStatus.PENDING) {
      if (title) service.title = title;
      if (description) service.description = description;
    } else if (title || description) {
      // If not client or not pending, but title/desc are being changed
      throw new ForbiddenException('Cannot modify title/description for this service.');
    }

    if (status) {
      // Worker accepting a PENDING service
      if (currentUser.userType === UserType.WORKER && status === ServiceStatus.ACCEPTED && service.status === ServiceStatus.PENDING) {
        service.status = ServiceStatus.ACCEPTED;
        service.worker = { id: Number(currentUser.id) } as UserEntity; // Ensure ID is number, cast to UserEntity partial
      }
      // Worker declining/cancelling an ACCEPTED service (back to PENDING or CANCELLED)
      else if (currentUser.id === service.worker?.id && service.status === ServiceStatus.ACCEPTED) {
        if (status === ServiceStatus.PENDING || status === ServiceStatus.CANCELLED) {
          service.status = status;
          if(status === ServiceStatus.PENDING) service.worker = null; // Unassign worker if back to PENDING
        } else {
          throw new UnprocessableEntityException(`Worker cannot set status to ${status} from ${service.status}`);
        }
      }
      // Client cancelling a PENDING or ACCEPTED service
      else if (currentUser.id === service.client.id && (service.status === ServiceStatus.PENDING || service.status === ServiceStatus.ACCEPTED) && status === ServiceStatus.CANCELLED) {
        service.status = ServiceStatus.CANCELLED;
      }
      // Completing a service (either client or assigned worker)
      else if (status === ServiceStatus.COMPLETED && service.status === ServiceStatus.ACCEPTED && (currentUser.id === service.client.id || currentUser.id === service.worker?.id)) {
        service.status = ServiceStatus.COMPLETED;
      }
      // If none of the above, the status change is invalid
      else {
        throw new UnprocessableEntityException(`Cannot change service status from ${service.status} to ${status} with your role.`);
      }
    }

    // WorkerId can only be set implicitly by a worker accepting a job.
    // Direct setting of workerId via DTO is restricted by above logic.
    if (workerId && !(currentUser.userType === UserType.WORKER && status === ServiceStatus.ACCEPTED && service.status === ServiceStatus.PENDING)) {
        if (service.worker?.id !== workerId || service.status !== ServiceStatus.ACCEPTED) {
             throw new ForbiddenException('Worker assignment is handled by service acceptance flow.');
        }
    }


    return this.serviceRepository.save(service);
  }

  async remove(id: number, currentUser: User): Promise<void> {
    const service = await this.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    // Add logic: only client or admin (if roles were more granular) can delete
    // For now, let's assume client can delete PENDING/CANCELLED, or worker if assigned and status allows
    if (currentUser.id !== service.client.id && currentUser.id !== service.worker?.id) {
        throw new ForbiddenException('You are not authorized to delete this service.');
    }
    if (service.status === ServiceStatus.ACCEPTED && currentUser.id === service.client.id) {
        throw new ForbiddenException('Client cannot delete an accepted service. Please cancel first.');
    }
     if (service.status === ServiceStatus.COMPLETED) {
        throw new ForbiddenException('Cannot delete a completed service.');
    }

    await this.serviceRepository.softDelete(id);
  }
}
