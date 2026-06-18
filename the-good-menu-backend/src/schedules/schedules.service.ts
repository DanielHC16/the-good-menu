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

  findAll() {
    return this.schedulesRepository.find({
      relations: {
        meal: true,
      },
    });
  }

  async findOne(id: number) {
    const schedule = await this.schedulesRepository.findOne({
      where: { id },
      relations: {
        meal: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule #${id} was not found.`);
    }

    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.schedulesRepository.preload({
      id,
      ...updateScheduleDto,
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule #${id} was not found.`);
    }

    await this.schedulesRepository.save(schedule);
    return this.findOne(id);
  }

  async remove(id: number) {
    const schedule = await this.findOne(id);
    return this.schedulesRepository.remove(schedule);
  }
}
