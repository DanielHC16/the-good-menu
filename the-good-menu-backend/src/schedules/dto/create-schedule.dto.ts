import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, Min } from 'class-validator';
import { TimeSlot } from '../entities/schedule.entity';

export class CreateScheduleDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  mealId: number;

  @IsDateString()
  scheduledDate: string;

  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;
}
