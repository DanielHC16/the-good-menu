import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
  DeleteDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Meal } from './meal.entity';

@Check(
  'CHK_meal_ingredients_product_or_custom_name',
  '((product_id IS NOT NULL AND custom_ingredient_name IS NULL) OR (product_id IS NULL AND custom_ingredient_name IS NOT NULL))',
)
@Entity('meal_ingredients')
export class MealIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'meal_id', type: 'int' })
  mealId: number;

  @ManyToOne(() => Meal, (meal) => meal.ingredients, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @Column({ name: 'product_id', type: 'int', nullable: true })
  productId: number | null;

  @ManyToOne(() => Product, (product) => product.mealIngredients, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;

  @Column()
  quantity: string;

  @Column({ type: 'varchar', nullable: true })
  customIngredientName: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
