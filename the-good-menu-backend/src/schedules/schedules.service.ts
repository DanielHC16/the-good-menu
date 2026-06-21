import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly schedulesRepository: Repository<Schedule>,
  ) {}

  create(createScheduleDto: CreateScheduleDto) {
    const schedule = this.schedulesRepository.create(createScheduleDto);
    return this.schedulesRepository.save(schedule);
  }

  async findAll(userId: number) {
    return await this.schedulesRepository.find({
      where: { userId: userId },
      // Add the nested relations here:
      relations: ['meal', 'meal.ingredients', 'meal.ingredients.product'],
    });
  }

  async findOne(id: number, userId: number) {
    const schedule = await this.schedulesRepository.findOne({
      where: { id, userId },
      relations: {
        meal: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule #${id} was not found.`);
    }

    return schedule;
  }

  async update(
    id: number,
    userId: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.findOne(id, userId);
    Object.assign(schedule, updateScheduleDto);

    return this.schedulesRepository.save(schedule);
  }

  async remove(id: number, userId: number) {
    const schedule = await this.findOne(id, userId);
    await this.schedulesRepository.remove(schedule);

    return { message: `Record #${id} successfully deleted.` };
  }
}
