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
    await this.findOne(id); // Verify meal exists (throws NotFoundException)
    const { ingredients, ...mealFields } = updateMealDto;

    if (Object.keys(mealFields).length > 0) {
      await this.mealsRepository.update(id, mealFields);
    }

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
    await this.findOne(id); // Verify meal exists (throws NotFoundException)
    await this.mealsRepository.softDelete(id);

    return { message: `Record #${id} successfully deleted.` };
  }
}
