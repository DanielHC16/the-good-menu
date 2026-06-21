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
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    id?: number;
    userId: number;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  create(
    @Body() createMealDto: CreateMealDto,
    @Request() req: AuthenticatedRequest,
  ) {
    createMealDto.userId = req.user.id ?? req.user.userId;
    return this.mealsService.create(createMealDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.mealsService.findAll(req.user.id ?? req.user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id ?? req.user.userId;
    return this.mealsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMealDto: UpdateMealDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id ?? req.user.userId;
    return this.mealsService.update(id, userId, updateMealDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id ?? req.user.userId;
    return this.mealsService.remove(id, userId);
  }
}
