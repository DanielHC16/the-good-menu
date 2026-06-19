import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';
import { Meal } from '../../meals/entities/meal.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  /**
   * Password is excluded from standard SELECT queries via `select: false`.
   * Must be explicitly selected with `.addSelect('user.password')` when needed
   * (e.g., during login validation).
   */
  @Column({ select: false })
  password!: string;

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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  // ─── Lifecycle hooks: auto-hash password before persistence ────────

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
