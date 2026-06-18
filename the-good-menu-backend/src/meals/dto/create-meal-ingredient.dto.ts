import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateIf } from 'class-validator';

export class CreateMealIngredientDto {
  @Type(() => Number)
  @IsInt()
  mealId: number;

  @ValidateIf((mealIngredient: CreateMealIngredientDto) => {
    return !mealIngredient.customIngredientName;
  })
  @Type(() => Number)
  @IsInt()
  productId?: number;

  @IsString()
  quantity: string;

  @ValidateIf((mealIngredient: CreateMealIngredientDto) => {
    return !mealIngredient.productId;
  })
  @IsString()
  customIngredientName?: string;
}
