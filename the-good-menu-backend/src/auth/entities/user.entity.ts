import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';
import { Meal } from '../../meals/entities/meal.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @OneToMany(() => Meal, (meal) => meal.user)
  meals!: Meal[];

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules!: Schedule[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs!: AuditLog[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
