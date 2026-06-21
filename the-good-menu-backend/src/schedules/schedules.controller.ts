import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    id?: number;
    userId: number;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    createScheduleDto.userId = req.user.id ?? req.user.userId;
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.schedulesService.findAll(req.user.id ?? req.user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id ?? req.user.userId;
    return this.schedulesService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id ?? req.user.userId;
    return this.schedulesService.update(id, userId, updateScheduleDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id ?? req.user.userId;
    return this.schedulesService.remove(id, userId);
  }
}
