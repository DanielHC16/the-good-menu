import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealIngredient } from './entities/meal-ingredient.entity';
import { Meal } from './entities/meal.entity';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealsRepository: Repository<Meal>,
    @InjectRepository(MealIngredient)
    private readonly mealIngredientsRepository: Repository<MealIngredient>,
  ) {}

  create(createMealDto: CreateMealDto) {
    const { ingredients, ...mealFields } = createMealDto;
    const meal = this.mealsRepository.create({
      ...mealFields,
      ingredients: this.mealIngredientsRepository.create(ingredients),
    });

    return this.mealsRepository.save(meal);
  }

  findAll() {
    return this.mealsRepository.find({
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

    if (ingredients) {
      await this.mealIngredientsRepository.delete({ mealId: id });
      meal.ingredients = this.mealIngredientsRepository.create(ingredients);
    }

    await this.mealsRepository.save(meal);
    return this.findOne(id);
  }

  async remove(id: number) {
    const meal = await this.findOne(id);
    return this.mealsRepository.softRemove(meal);
  }
}
