import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Meal } from '../../meals/entities/meal.entity';

export enum TimeSlot {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
}

@Unique('UQ_schedules_user_date_time_slot', [
  'userId',
  'scheduledDate',
  'timeSlot',
])
@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => User, (user) => user.schedules, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'meal_id', type: 'int' })
  mealId: number;

  @ManyToOne(() => Meal, (meal) => meal.schedules, {
    nullable: false,
  })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @Column({ name: 'scheduled_date', type: 'date' })
  scheduledDate: string;

  @Column({ name: 'time_slot', type: 'enum', enum: TimeSlot })
  timeSlot: TimeSlot;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
