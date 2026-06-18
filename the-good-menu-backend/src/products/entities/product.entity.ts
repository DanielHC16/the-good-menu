import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { MealIngredient } from '../../meals/entities/meal-ingredient.entity';

@Entity('products') // This tells MySQL to name the table "products"
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'varchar', nullable: true })
  imageUrl!: string;

  @Column('int')
  calories!: number;

  @Column('decimal', { name: 'protein_g', precision: 5, scale: 2 })
  proteinG!: number;

  @Column('decimal', { name: 'carbs_g', precision: 5, scale: 2 })
  carbsG!: number;

  @Column('decimal', { name: 'fat_g', precision: 5, scale: 2 })
  fatG!: number;

  @OneToMany(() => MealIngredient, (mealIngredient) => mealIngredient.product)
  mealIngredients!: MealIngredient[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' }) // This enables your Soft Delete business rule!
  deletedAt!: Date | null;
}
