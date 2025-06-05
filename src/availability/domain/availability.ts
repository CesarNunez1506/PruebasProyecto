import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { DayOfWeek } from './enums/day-of-week.enum';

const idType = Number;

export class Availability {
  @ApiProperty({ type: idType })
  id: number | string;

  @ApiProperty({ type: () => User })
  worker: User; // The user (worker) this availability belongs to

  @ApiProperty({ enum: DayOfWeek, enumName: 'DayOfWeek', example: DayOfWeek.MONDAY })
  dayOfWeek: DayOfWeek;

  @ApiProperty({ type: String, example: '09:00' })
  startTime: string; // Consider using a more specific time type if needed, e.g., HH:mm

  @ApiProperty({ type: String, example: '17:00' })
  endTime: string; // Consider using a more specific time type if needed, e.g., HH:mm

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
