import { PartialType } from '@nestjs/mapped-types';
import { CreateMealIngredientDto } from './create-meal-ingredient.dto';

export class UpdateMealIngredientDto extends PartialType(
  CreateMealIngredientDto,
) {}
