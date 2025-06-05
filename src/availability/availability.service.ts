import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailabilityEntity } from './infrastructure/persistence/relational/entities/availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { User } from '../users/domain/user';
import { Availability } from './domain/availability'; // Domain object
import { DayOfWeek } from './domain/enums/day-of-week.enum'; // If needed for logic

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(AvailabilityEntity)
    private readonly availabilityRepository: Repository<AvailabilityEntity>,
  ) {}

  async setAvailability(createAvailabilityDtos: CreateAvailabilityDto[], worker: User): Promise<AvailabilityEntity[]> {
    // Simple approach: delete all existing for this worker and recreate
    await this.availabilityRepository.delete({ worker: { id: worker.id } });

    const availabilities = createAvailabilityDtos.map(dto =>
      this.availabilityRepository.create({
        ...dto,
        worker: { id: worker.id } as User,
      })
    );
    return this.availabilityRepository.save(availabilities);
  }

  async getAvailability(workerId: number): Promise<AvailabilityEntity[]> {
    return this.availabilityRepository.find({
      where: { worker: { id: workerId } },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' }, // Sort for easier display
    });
  }

  async removeAvailability(availabilityId: number, worker: User): Promise<void> {
    const result = await this.availabilityRepository.delete({
      id: availabilityId,
      worker: { id: worker.id }
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Availability slot with ID ${availabilityId} not found or does not belong to this worker.`);
    }
  }

  async checkWorkerAvailability(workerId: number, dateTime: Date): Promise<boolean> {
    const dayOfWeek = (dateTime.getDay() === 0 ? 6 : dateTime.getDay() -1).toString() as DayOfWeek; // MON=0 to SUN=6 -> DayOfWeek enum
    // This mapping needs to be exact with your DayOfWeek enum.
    // Example: if MONDAY = 'MONDAY', then:
    const dayNames: DayOfWeek[] = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY];
    const requestDay = dayNames[dateTime.getDay() === 0 ? 6 : dateTime.getDay() - 1]; // JS getDay(): Sun=0, Mon=1..Sat=6

    const requestTime = dateTime.toTimeString().slice(0, 5); // HH:mm format

    const availabilities = await this.availabilityRepository.find({
      where: {
        worker: { id: workerId },
        dayOfWeek: requestDay,
      },
    });

    if (!availabilities.length) {
      return false;
    }

    return availabilities.some(slot => {
      return requestTime >= slot.startTime && requestTime < slot.endTime;
    });
  }
}
