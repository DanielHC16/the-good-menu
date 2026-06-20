import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealIngredient } from './entities/meal-ingredient.entity';
import { Meal } from './entities/meal.entity';
import { Schedule } from '../schedules/entities/schedule.entity';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealsRepository: Repository<Meal>,
    @InjectRepository(MealIngredient)
    private readonly mealIngredientsRepository: Repository<MealIngredient>,
    @InjectRepository(Schedule)
    private readonly schedulesRepository: Repository<Schedule>,
  ) {}

  create(createMealDto: CreateMealDto) {
    const { ingredients, ...mealFields } = createMealDto;
    const meal = this.mealsRepository.create({
      ...mealFields,
      ingredients: this.mealIngredientsRepository.create(ingredients),
    });

    return this.mealsRepository.save(meal);
  }

  findAll(userId: number) {
    return this.mealsRepository.find({
      where: [
        { userId: userId },
        { userId: IsNull() },
      ],
      relations: {
        ingredients: {
          product: true,
        },
        schedules: true,
      },
    });
  }

  async findOne(id: number) {
    const meal = await this.mealsRepository.findOne({
      where: { id },
      relations: {
        ingredients: {
          product: true,
        },
        schedules: true,
      },
    });

    if (!meal) {
      throw new NotFoundException(`Meal #${id} was not found.`);
    }

    return meal;
  }

  async update(id: number, updateMealDto: UpdateMealDto) {
    const meal = await this.findOne(id);
    const { ingredients, ...mealFields } = updateMealDto;

    Object.assign(meal, mealFields);
    await this.mealsRepository.save(meal);

    if (ingredients) {
      await this.mealIngredientsRepository.delete({ mealId: id });
      const newIngredients = this.mealIngredientsRepository.create(
        ingredients.map((ing) => ({ ...ing, mealId: id })),
      );
      await this.mealIngredientsRepository.save(newIngredients);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const meal = await this.mealsRepository.findOneBy({ id });

    if (!meal) {
      throw new NotFoundException(`Meal #${id} was not found.`);
    }

    // Check if this meal is referenced by any schedule
    const scheduleCount = await this.schedulesRepository.count({
      where: { mealId: id },
    });

    if (scheduleCount > 0) {
      // Meal is linked to schedule(s) — preserve via soft delete
      await this.mealsRepository.softRemove(meal);
      return { message: `Meal #${id} successfully soft-deleted.` };
    }

    // Meal has never been scheduled — clean hard delete
    await this.mealsRepository.remove(meal);
    return { message: `Meal #${id} successfully hard-deleted.` };
  }
}
