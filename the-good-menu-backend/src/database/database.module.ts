import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Meal } from '../meals/entities/meal.entity';
import { MealIngredient } from '../meals/entities/meal-ingredient.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { SeederService } from './seeder.service';
import { DatabaseController } from './database.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Meal, MealIngredient, Schedule]),
  ],
  controllers: [DatabaseController],
  providers: [SeederService],
})
export class DatabaseModule {}
