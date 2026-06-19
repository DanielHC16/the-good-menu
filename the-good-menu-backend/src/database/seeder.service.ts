import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Meal } from '../meals/entities/meal.entity';
import { MealIngredient } from '../meals/entities/meal-ingredient.entity';
import { Schedule } from '../schedules/entities/schedule.entity';

// Load JSON seed data (wildcard import to handle CJS/ESM interop)
import * as productsData from './data/mock-products.json';
import * as mealsData from './data/mock-meals.json';
import * as schedulesData from './data/mock-schedules.json';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Meal)
    private readonly mealsRepository: Repository<Meal>,
    @InjectRepository(MealIngredient)
    private readonly mealIngredientsRepository: Repository<MealIngredient>,
    @InjectRepository(Schedule)
    private readonly schedulesRepository: Repository<Schedule>,
  ) {}

  /**
   * Orchestrates a full database seed: clears existing data in reverse
   * dependency order, then inserts Products → Meals → Schedules.
   */
  async seedAll() {
    this.logger.log('Starting full database seed...');

    // ── Spam Shield: disable audit logging for seed operations ──
    process.env.IS_SEEDING = 'true';

    try {
      // Safely extract JSON arrays (handles .default wrapping from CJS compilation)
      const productsArray: any[] = Array.isArray(productsData)
        ? productsData
        : (productsData as any).default;
      const mealsArray: any[] = Array.isArray(mealsData)
        ? mealsData
        : (mealsData as any).default;
      const schedulesArray: any[] = Array.isArray(schedulesData)
        ? schedulesData
        : (schedulesData as any).default;

      // Phase 1: Clear tables in reverse dependency order (FK safety)
      await this.clearTables();

      // Phase 2: Seed Products
      const savedProducts = await this.seedProducts(productsArray);

      // Phase 3: Seed Meals (with cascaded ingredients)
      const savedMeals = await this.seedMeals(mealsArray);

      // Phase 4: Seed Schedules
      const savedSchedules = await this.seedSchedules(schedulesArray);

      this.logger.log('Database seed completed successfully.');

      return {
        message: 'Database seeded successfully.',
        summary: {
          productsCreated: savedProducts,
          mealsCreated: savedMeals,
          schedulesCreated: savedSchedules,
        },
      };
    } finally {
      // ── Guarantee audit logging resumes for real traffic ──
      process.env.IS_SEEDING = 'false';
    }
  }

  /**
   * Truncates tables in reverse dependency order to respect foreign keys.
   * Uses raw queries with FOREIGN_KEY_CHECKS disabled for clean truncation.
   */
  private async clearTables() {
    this.logger.log('Clearing existing seed data...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
      await queryRunner.query('TRUNCATE TABLE `schedules`');
      await queryRunner.query('TRUNCATE TABLE `meal_ingredients`');
      await queryRunner.query('TRUNCATE TABLE `meals`');
      await queryRunner.query('TRUNCATE TABLE `products`');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
    } finally {
      await queryRunner.release();
    }

    this.logger.log('Tables cleared.');
  }

  private async seedProducts(items: any[]): Promise<number> {
    this.logger.log(`Seeding ${items.length} products...`);

    for (const item of items) {
      const newProduct = this.productsRepository.create(item);
      await this.productsRepository.save(newProduct);
    }

    return items.length;
  }

  private async seedMeals(items: any[]): Promise<number> {
    this.logger.log(`Seeding ${items.length} meals with ingredients...`);

    for (const mealData of items) {
      const { ingredients, ...mealFields } = mealData;

      const meal = this.mealsRepository.create({
        ...mealFields,
        ingredients: this.mealIngredientsRepository.create(
          ingredients.map((ing: any) => ({
            productId: ing.productId,
            quantity: ing.quantity,
            customIngredientName: ing.customIngredientName ?? undefined,
          })),
        ),
      });

      await this.mealsRepository.save(meal);
    }

    return items.length;
  }

  private async seedSchedules(items: any[]): Promise<number> {
    this.logger.log(`Seeding ${items.length} schedules...`);

    for (const item of items) {
      const newSchedule = this.schedulesRepository.create(item);
      await this.schedulesRepository.save(newSchedule);
    }

    return items.length;
  }
}
