import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ProductOrCustomIngredient', async: false })
class ProductOrCustomIngredientConstraint implements ValidatorConstraintInterface {
  validate(_quantity: string, args: ValidationArguments) {
    const ingredient = args.object as IngredientDto;
    const hasProductId =
      ingredient.productId !== undefined && ingredient.productId !== null;
    const hasCustomIngredientName =
      typeof ingredient.customIngredientName === 'string' &&
      ingredient.customIngredientName.trim().length > 0;

    return hasProductId !== hasCustomIngredientName;
  }

  defaultMessage() {
    return 'Each ingredient must include either productId or customIngredientName, but not both.';
  }
}

export class IngredientDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productId?: number;

  @IsString()
  @IsNotEmpty()
  @Validate(ProductOrCustomIngredientConstraint)
  quantity: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  customIngredientName?: string;
}

export class CreateMealDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  preparationGuide: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];
}
